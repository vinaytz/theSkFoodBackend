import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { Menu, Order, User } from '@/types';

// Auth queries
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      const { data } = await api.get('/userAuth/profile');
      return data;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post('/userAuth/login', { email, password });
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { data } = await api.post('/userAuth/signup', { name, email, password });
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/userAuth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('auth-token');
      queryClient.clear();
    },
  });
};

// Menu queries
export const useLunchMenu = () => {
  return useQuery({
    queryKey: ['menu', 'lunch'],
    queryFn: async (): Promise<Menu[]> => {
      const { data } = await api.get('/userPanel/seeLunchMenu');
      return data;
    },
  });
};

export const useDinnerMenu = () => {
  return useQuery({
    queryKey: ['menu', 'dinner'],
    queryFn: async (): Promise<Menu[]> => {
      const { data } = await api.get('/userPanel/seeDinnerMenu');
      return data;
    },
  });
};

// Order queries
export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/userPanel/myAllOrders');
      return data;
    },
  });
};

export const useConfirmedOrders = () => {
  return useQuery({
    queryKey: ['orders', 'confirmed'],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/userPanel/confirmedOrders');
      return data;
    },
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async (): Promise<Order> => {
      const { data } = await api.get(`/userPanel/myOrderwithId/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/userPanel/orderPreparedThali', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Admin queries
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post('/admin/login', { email, password });
      return data;
    },
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/admin/allOrders');
      return data;
    },
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (menuData: any) => {
      const { data } = await api.put('/admin/createMeal', menuData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('imageFile', file);
      const { data } = await api.post('/admin/imageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });
};