# Inventory Reorder Predictor

## Overview
This project is a React web application that predicts which products need to be reordered based on their current inventory levels, average weekly sales, and replenishment lead time. The application fetches more than 100 real product names from an online API and processes them into a dashboard that shows which items require restocking.

# Features

## Product Fetching
The app retrieves over 100 products from a public API. Each product includes a name from the API, while other required values such as inventory levels, weekly sales, and lead time are generated within the app.

## Prediction System
The application uses a simple prediction model to determine whether a product needs to be reordered. It evaluates inventory, sales pace, and how many days it takes to restock.

## Dashboard
The app displays all products in a clean and simple dashboard. Each row shows the product name, inventory, weekly sales, lead time, and whether it should be reordered. Items that need restocking are clearly marked.

## How It Works
### Data Flow
1. The app fetches product names from the API.
2. Each product is assigned inventory, sales, and lead time values.
3. The prediction system evaluates each product.
4. The dashboard displays the results.

## User Interaction
The user simply opens the app. All data loading, prediction processing, and display updates happen automatically.

## Requirements
- React environment
- Internet connection for product fetching

## Running the App
Install the required packages and start the development server using your package manager. The app runs locally in the browser.

## Purpose
This project follows the activity requirements provided in the PDF: creating a React application that uses a prediction model and processes real product data to produce reorder suggestions.

## Notes
- The app keeps the interface simple.
- All prediction work happens directly in the browser.
