-- Task One: 5.1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- Task One: 5.2
UPDATE public.account 
	SET account_type = 'Admin'
	WHERE account_firstname = 'Tony' 
		AND account_lastname = 'Stark';

-- Task One: 5.3
DELETE FROM public.account 
	WHERE account_firstname = 'Tony' 
		AND account_lastname = 'Stark'
		AND account_type = 'Admin'
		AND account_email = 'tony@starkent.com'
		AND account_password = 'Iam1ronM@n';

-- Assignment 2 / Task One: 5.4
UPDATE public.inventory
	SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
	WHERE inv_make = 'GM' 
		AND inv_model = 'Hummer';
		
-- Task One: 5.5
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification 
	ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- Assignment 2 / Task One: 5.6
UPDATE public.inventory
	SET 
		inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
 		inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
		