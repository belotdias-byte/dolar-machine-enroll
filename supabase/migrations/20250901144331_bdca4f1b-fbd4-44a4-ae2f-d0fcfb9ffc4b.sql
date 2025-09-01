-- Fix security vulnerability: Remove public access to registrations table
-- and implement proper access controls

-- First, drop the overly permissive policy that allows anyone to view registrations
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.registrations;

-- Create a secure policy that only allows admins to view registration data
CREATE POLICY "Only admins can view registrations" 
ON public.registrations 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Keep the insert policy as-is since we want people to be able to register
-- The "Anyone can insert registrations" policy remains unchanged