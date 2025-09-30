import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create((set) => ({
  profile: null,
  metrics: null,
  recentStories: [],
  recentPosts: [],
  isLoading: false,
  isSavingProfile: false,
  isSavingPreferences: false,
  isChangingPassword: false,
  isUploadingAvatar: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users/me");
      const { user, metrics, recentStories, recentPosts } = res.data;
      set({ profile: user, metrics, recentStories, recentPosts });
      useAuthStore.getState().setAuthUser(user);
      return true;
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error(error?.response?.data?.message || "Failed to load profile");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  saveProfile: async (payload) => {
    set({ isSavingProfile: true });
    try {
      const res = await axiosInstance.put("/users/me", payload);
      const { user } = res.data;
      set({ profile: user });
      useAuthStore.getState().setAuthUser(user);
      toast.success("Profile updated");
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      set({ isSavingProfile: false });
    }
  },

  savePreferences: async (payload) => {
    set({ isSavingPreferences: true });
    try {
      const res = await axiosInstance.put("/users/me/preferences", payload);
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, preferences: res.data.preferences }
          : state.profile,
      }));
      toast.success("Preferences updated");
      return true;
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update preferences"
      );
      return false;
    } finally {
      set({ isSavingPreferences: false });
    }
  },

  changePassword: async (payload) => {
    set({ isChangingPassword: true });
    try {
      await axiosInstance.post("/users/me/security/password", payload);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
      return false;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  uploadAvatar: async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    set({ isUploadingAvatar: true });
    try {
      const res = await axiosInstance.put("/users/me/avatar", formData);
      const profilePic = res.data.profilePic;
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, profilePic }
          : state.profile,
      }));
      const auth = useAuthStore.getState();
      auth.setAuthUser(
        auth.authUser ? { ...auth.authUser, profilePic } : auth.authUser
      );
      toast.success("Profile photo updated");
      return true;
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast.error(error?.response?.data?.message || "Failed to update avatar");
      return false;
    } finally {
      set({ isUploadingAvatar: false });
    }
  },
}));
