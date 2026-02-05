-- Safe seed script that won't duplicate data
INSERT INTO public.cms_packages (name, slug, description, price, status, order_index, features)
SELECT 'Starter', 'starter', 'Perfect for small projects', 19.99, 'active', 1, ARRAY['Feature 1', 'Feature 2']
WHERE NOT EXISTS (SELECT 1 FROM public.cms_packages WHERE slug = 'starter');

INSERT INTO public.cms_packages (name, slug, description, price, status, order_index, features)
SELECT 'Professional', 'professional', 'For growing teams', 49.99, 'active', 2, ARRAY['All Starter features', 'Priority support']
WHERE NOT EXISTS (SELECT 1 FROM public.cms_packages WHERE slug = 'professional');

INSERT INTO public.cms_packages (name, slug, description, price, status, order_index, features)
SELECT 'Enterprise', 'enterprise', 'For large organizations', 199.99, 'active', 3, ARRAY['All Professional features', 'Custom solutions']
WHERE NOT EXISTS (SELECT 1 FROM public.cms_packages WHERE slug = 'enterprise');

-- Seed services
INSERT INTO public.cms_services (title, slug, description, status, order_index)
SELECT 'Web Development', 'web-development', 'Custom website development', 'active', 1
WHERE NOT EXISTS (SELECT 1 FROM public.cms_services WHERE slug = 'web-development');

INSERT INTO public.cms_services (title, slug, description, status, order_index)
SELECT 'Mobile Apps', 'mobile-apps', 'iOS and Android apps', 'active', 2
WHERE NOT EXISTS (SELECT 1 FROM public.cms_services WHERE slug = 'mobile-apps');