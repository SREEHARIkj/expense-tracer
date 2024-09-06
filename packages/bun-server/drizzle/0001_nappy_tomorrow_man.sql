CREATE TABLE `expense_categories` (
	`category_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_name` text
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer,
	`amount` text,
	`merchant` text,
	`category_id` integer,
	FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `income_categories` (
	`category_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_name` text
);
--> statement-breakpoint
CREATE TABLE `incomes` (
	`income_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer,
	`amount` text,
	`source` text,
	`category_id` integer,
	FOREIGN KEY (`category_id`) REFERENCES `income_categories`(`category_id`) ON UPDATE no action ON DELETE no action
);
