# E-commerce-Nest
A scalable and modular RESTful API for an E-Commerce platform built using NestJS.

This backend system handles authentication, product management, cart operations, orders, and secure online payments.
Designed following clean architecture and best practices to ensure scalability and maintainability.

🚀 Tech Stack

Framework: NestJS

Language: TypeScript

Database: MongoDB

ODM: Mongoose

Authentication: JWT

Authorization: Role-Based Access Control

Payment Integration: Stripe

API Documentation: Swagger

✨ Features
🔐 Authentication & Authorization

User Registration & Login

JWT Authentication

Role-based permissions (Admin / User)

Protected Routes

🏷 Category & Brand Management

CRUD operations

Subcategories support

🛍 Product Module

Create / Update / Delete products

Upload product images

Pagination

Filtering & Search

🛒 Cart System

Add to cart

Update quantity

Remove items

Clear cart

📦 Orders System

Create order

Order history

Update order status

Stripe payment checkout

Webhook handling

🏗 Project Structure
src/
│
├── auth/
├── users/
├── categories/
├── brands/
├── products/
├── cart/
├── orders/
├── common/
└── main.ts