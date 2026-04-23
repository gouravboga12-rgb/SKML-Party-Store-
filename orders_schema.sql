-- 1. Orders table (Metadata for the whole purchase)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    pincode TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    payment_id TEXT, -- Razorpay Payment ID
    payment_status TEXT DEFAULT 'pending',
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Order Items table (Specific products in each order)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12,2) NOT NULL,
    selected_color TEXT,
    selected_size TEXT,
    selected_dimension TEXT,
    selected_height DECIMAL(12,2),
    selected_width DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Admin (you) can view/update all orders
CREATE POLICY "Admin can manage all orders" ON public.orders FOR ALL USING (
    auth.jwt()->>'email' = 'trendingfabricstore@gmail.com'
);
CREATE POLICY "Admin can manage all order items" ON public.order_items FOR ALL USING (
    auth.jwt()->>'email' = 'trendingfabricstore@gmail.com'
);
