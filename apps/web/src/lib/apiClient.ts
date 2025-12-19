import { ChefProfileClient, IdentityClient, JobClient, RestaurantProfileClient } from '@chefnext/api-client';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:8080';

export const identityClient = new IdentityClient({ baseUrl: API_BASE_URL });
export const chefProfileClient = new ChefProfileClient({ baseUrl: API_BASE_URL });
export const restaurantProfileClient = new RestaurantProfileClient({ baseUrl: API_BASE_URL });
export const jobClient = new JobClient({ baseUrl: API_BASE_URL });
