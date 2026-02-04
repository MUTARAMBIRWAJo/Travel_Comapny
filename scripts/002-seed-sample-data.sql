-- Insert sample data for We-Of-You Travel platform

-- Insert Roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'System administrator with full access', '["manage_users", "manage_content", "view_analytics", "manage_settings"]'::jsonb),
('travel_agent', 'Travel agent handling bookings and requests', '["view_requests", "assign_trips", "manage_bookings", "communicate_clients"]'::jsonb),
('corporate_client', 'Corporate company administrator', '["manage_employees", "view_analytics", "set_policy", "view_reports"]'::jsonb),
('corporate_employee', 'Employee requesting travel', '["request_trip", "view_itinerary", "submit_expenses"]'::jsonb),
('traveler', 'Individual traveler', '["request_trip", "view_trips", "manage_profile"]'::jsonb),
('guest', 'Public website visitor', '["view_packages", "view_blog", "contact_support"]'::jsonb);

-- Insert Companies
INSERT INTO companies (name, country, industry, travel_budget, esg_settings, logo_url) VALUES
('Tech Innovations Inc', 'USA', 'Technology', 500000.00, '{"tracking_enabled": true, "carbon_offset": true, "target_carbon_neutral_by": 2030}'::jsonb, NULL),
('Global Finance Corp', 'UK', 'Finance', 750000.00, '{"tracking_enabled": true, "carbon_offset": false}'::jsonb, NULL),
('African Ventures Ltd', 'Rwanda', 'Consulting', 150000.00, '{"tracking_enabled": true, "carbon_offset": true}'::jsonb, NULL);

-- Insert Destinations
INSERT INTO destinations (name, country, region, currency, description, climate, best_season) VALUES
('Kigali', 'Rwanda', 'Central', 'RWF', 'Capital of Rwanda, known for its vibrant culture and growth', 'Tropical', 'June-September'),
('Kampala', 'Uganda', 'East Africa', 'UGX', 'Uganda''s capital, gateway to the Pearl of Africa', 'Tropical', 'July-August'),
('Nairobi', 'Kenya', 'East Africa', 'KES', 'Kenya''s vibrant capital city', 'Subtropical', 'July-September'),
('Paris', 'France', 'Western Europe', 'EUR', 'The City of Light, romantic destination', 'Temperate', 'April-June'),
('Barcelona', 'Spain', 'Western Europe', 'EUR', 'Beach city with architecture and culture', 'Mediterranean', 'May-September'),
('New York', 'USA', 'North America', 'USD', 'The city that never sleeps', 'Temperate', 'September-November');

-- Insert Travel Packages
INSERT INTO packages (title, category, description, price_usd, duration_days, destination_id, itinerary, image_url, amenities) VALUES
('Rwanda Cultural Experience', 'cultural', 'Immerse yourself in Rwandan culture, visits to local communities and historical sites', 2500, 7, 
  (SELECT id FROM destinations WHERE name = 'Kigali'), 
  '["Day 1: Arrive Kigali", "Day 2-3: City tour", "Day 4-5: Village visits", "Day 6: Musée de Génocide", "Day 7: Departure"]'::jsonb,
  NULL, '["Guided tours", "Local meals", "Hotel accommodation", "Transport"]'::jsonb),
  
('East Africa Adventure', 'adventure', 'Explore Kenya, Uganda and Tanzania wildlife and landscapes', 5000, 10,
  (SELECT id FROM destinations WHERE name = 'Nairobi'),
  '["Day 1-2: Nairobi", "Day 3-5: Safari", "Day 6-8: Uganda", "Day 9-10: Tanzania"]'::jsonb,
  NULL, '["Game drives", "Camping", "Professional guides", "All meals"]'::jsonb),

('European Cities Tour', 'leisure', 'Visit Paris, Barcelona and surrounding cities', 4500, 14,
  (SELECT id FROM destinations WHERE name = 'Paris'),
  '["Days 1-5: Paris", "Days 6-10: Barcelona", "Days 11-14: Day trips and return"]'::jsonb,
  NULL, '["5-star hotels", "Guided tours", "Travel insurance", "Meals"]'::jsonb),

('New York Business Conference', 'corporate', 'Network and learn at leading business conferences in NYC', 3500, 5,
  (SELECT id FROM destinations WHERE name = 'New York'),
  '["Day 1: Arrival", "Days 2-4: Conference attendance", "Day 5: Departure"]'::jsonb,
  NULL, '["Hotels', 'Conference pass', 'Ground transport', 'Meals"]'::jsonb);

-- Insert Sample Users
INSERT INTO users (email, password_hash, full_name, role, preferred_language, preferred_currency, company_id) VALUES
-- Admin
('admin@weofyou.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Admin User', 'admin', 'en', 'USD', NULL),

-- Travel Agents
('agent.sarah@weofyou.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Sarah Johnson', 'travel_agent', 'en', 'USD', NULL),
('agent.jean@weofyou.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Jean Pierre', 'travel_agent', 'fr', 'EUR', NULL),

-- Corporate Clients
('company.admin1@tech.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Michael Chen', 'corporate_client', 'en', 'USD', 
  (SELECT id FROM companies WHERE name = 'Tech Innovations Inc')),
('company.admin2@finance.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Elizabeth Brown', 'corporate_client', 'en', 'GBP',
  (SELECT id FROM companies WHERE name = 'Global Finance Corp')),

-- Corporate Employees
('employee1@tech.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'David Liu', 'corporate_employee', 'en', 'USD',
  (SELECT id FROM companies WHERE name = 'Tech Innovations Inc')),
('employee2@tech.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Emma Wilson', 'corporate_employee', 'en', 'USD',
  (SELECT id FROM companies WHERE name = 'Tech Innovations Inc')),

-- Individual Travelers
('john.traveler@email.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'John Smith', 'traveler', 'en', 'USD', NULL),
('marie.voyageur@email.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Marie Dubois', 'traveler', 'fr', 'EUR', NULL),
('amara.explorer@email.com', '$2b$10$YJT8x8C.8J9q5S2K9vQ9e.cN0Z3V9m2L8k7H9q3J8x5W2B1A0T9e', 'Amara Kiza', 'traveler', 'en', 'RWF', NULL);

-- Insert Travel Requests
INSERT INTO travel_requests (user_id, company_id, type, destination_id, start_date, end_date, travelers_count, status, budget_usd, notes) VALUES
((SELECT id FROM users WHERE email = 'david@tech.com' LIMIT 1), 
 (SELECT id FROM companies WHERE name = 'Tech Innovations Inc' LIMIT 1),
 'business', (SELECT id FROM destinations WHERE name = 'New York' LIMIT 1),
 '2026-03-15', '2026-03-20', 1, 'approved', 3500, 'Annual conference attendance'),

((SELECT id FROM users WHERE email = 'john.traveler@email.com' LIMIT 1),
 NULL,
 'leisure', (SELECT id FROM destinations WHERE name = 'Paris' LIMIT 1),
 '2026-04-01', '2026-04-15', 1, 'pending', 5000, 'Spring vacation');

-- Insert Blog Posts
INSERT INTO blog_posts (title, content, author_id, language, category, published_date) VALUES
('Top 10 Travel Destinations in 2026', 'Discover the most exciting destinations to visit this year...', 
 (SELECT id FROM users WHERE email = 'agent.sarah@weofyou.com' LIMIT 1), 'en', 'travel-tips', NOW()),

('Comment préparer votre voyage en Afrique', 'Les meilleurs conseils pour planifier votre aventure africaine...',
 (SELECT id FROM users WHERE email = 'agent.jean@weofyou.com' LIMIT 1), 'fr', 'travel-tips', NOW()),

('Sustainable Travel: Reduce Your Carbon Footprint', 'Learn how to travel responsibly and protect the environment...',
 (SELECT id FROM users WHERE email = 'agent.sarah@weofyou.com' LIMIT 1), 'en', 'sustainability', NOW());
