# Vibe Tracker

## Overview

Vibe Tracker is a vibe adding and vibe finding web application designed specifically for mobile devices as an app MVP. 
The app allows users to track add vibes to places through an intuitive interface, and find places and planned event based on reported vibes from users. 
Key features include reporting new vibes at Places, browsing vibe history reports at Places, performing quick vibe checks, and managing favorite vibes and places. 
A planned paid feature is to add upcoming Plans at Places and setting an expected event Vibe. 

## System Architecture

### Frontend Architecture
- **Static Web Application**: Built with vanilla HTML5, CSS3, and JavaScript
- **Mobile-First Design**: Optimized for mobile with specific viewport dimensions (9×16 ratio)
- **Progressive Web App (PWA) Ready**: Includes meta tags for web app installation and offline capabilities
- **Responsive Navigation**: Hamburger menu with slide-out navigation panel
- **CSS Custom Properties**: Centralized design system using CSS variables for colors, spacing, and transitions

### User Interface Design
- **Minimalist Aesthetic**: Clean white background with black borders and text
- **Apple Design Language**: Uses system fonts and follows iOS design patterns
- **Accessibility Focus**: Proper ARIA labels, keyboard navigation support, and semantic HTML
- **Safe Area Support**: Handles iPhone notch and safe areas using CSS environment variables
- **Touch-Optimized**: Designed for touch interactions with appropriate button sizes

### Navigation System
- **Single Page Architecture**: Multiple HTML pages with shared navigation and styling
- **Consistent Header Structure**: Standardized meta tags, SEO optimization, and social media integration
- **Active State Management**: JavaScript-powered navigation state tracking
- **Accessibility**: Full keyboard and touch navigation support for all interactive elements

### Component Structure
- **Modular CSS**: Organized styling with CSS custom properties for maintainability
- **Reusable JavaScript**: Event-driven architecture with proper separation of concerns
- **Tab System**: Interactive tab panels for content organization
- **Action Buttons**: Standardized button interactions with visual feedback

### Data Management
- **PostgreSQL Database**: Planned: Neon-powered serverless PostgreSQL database with Drizzle ORM
- **Database Schema**: Structured tables for users, places, VibeChecks, plans, RSVPs, and user favorites
- **Relational Design**: Proper foreign key relationships to avoid duplication between places and events
- **Local State Management**: JavaScript-based state management for UI interactions
- **Database Storage Layer**: TypeScript storage interface with full CRUD operations

## External Dependencies

### Core Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with custom properties and flexbox/grid layouts
- **Vanilla JavaScript**: No external JavaScript frameworks or libraries

### SEO and Social Integration
- **Open Graph Protocol**: Facebook and social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing with large image cards
- **Search Engine Optimization**: Comprehensive meta tags and structured data

### Mobile Platform Integration
- **Apple Web App**: iOS-specific meta tags for home screen installation
- **Viewport Optimization**: 9x16 ratio mobile-specific viewport configuration
- **Touch Events**: Mobile-optimized touch interactions

### Database Architecture
- **Users Table**: Stores user accounts with username and email
- **Places Table**: Locations where VibeChecks and event Plans occur (ready for Google Maps integration)
- **VibeChecks Table**: User vibe reports at specific places with vibe and intensity ratings
- **Plans Table**: Planned events at places with expected vibes (includes paid feature flag)
- **Plan RSVPs Table**: User responses to planned events (going/maybe/not going)
- **User Favorites Table**: User's favorite places and vibe preferences

### Integration Points
- **Google Maps API**: Places table prepared with GoogleMapsPlaceId field for future integration
- **Backend API**: Database storage layer ready for REST API integration
- **Authentication System**: User table and relationships designed for future user accounts
- **Push Notifications**: PWA foundation supports future notification features
