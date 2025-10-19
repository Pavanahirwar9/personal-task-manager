# Appwrite Setup Guide for Personal Task Manager

This guide will help you set up your Appwrite project for the Personal Task Manager application.

## Prerequisites

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project in your Appwrite dashboard

## 1. Project Configuration

1. Go to your Appwrite project dashboard
2. Copy your **Project ID** from the project settings
3. Update your `.env` file:
   ```env
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   ```

## 2. Database Setup

### Create Database
1. Go to **Databases** in your Appwrite console
2. Click "Create Database"
3. Name it "task-manager-db" (or any name you prefer)
4. Copy the Database ID and update your `.env`:
   ```env
   VITE_APPWRITE_DATABASE_ID=your_database_id_here
   ```

### Create Collections

#### Tasks Collection
1. Click "Create Collection"
2. Name: "tasks"
3. Collection ID: "tasks" (use this exact ID)
4. Permissions: 
   - **Create**: `users`
   - **Read**: `users`
   - **Update**: `users`
   - **Delete**: `users`

#### Add Attributes to Tasks Collection:
- **title** (String, Size: 255, Required: Yes)
- **description** (String, Size: 2000, Required: No)
- **status** (Enum, Elements: ["pending", "completed"], Required: Yes, Default: "pending")
- **priority** (Enum, Elements: ["low", "medium", "high"], Required: Yes, Default: "medium")
- **dueDate** (DateTime, Required: No)
- **tags** (String[], Size: 50, Required: No)
- **attachments** (String[], Size: 500, Required: No)
- **userId** (String, Size: 50, Required: Yes)

#### Set Collection Permissions:
1. Go to Settings tab of the tasks collection
2. Set permissions:
   - **Create**: Add rule for `user:*` 
   - **Read**: Add rule for `user:*`
   - **Update**: Add rule for `user:*`
   - **Delete**: Add rule for `user:*`

## 3. Authentication Setup

1. Go to **Auth** in your Appwrite console
2. Enable **Email/Password** authentication
3. Configure your security settings as needed

## 4. Storage Setup (for file attachments)

1. Go to **Storage** in your Appwrite console
2. Click "Create Bucket"
3. Name: "task-attachments"
4. Bucket ID: "task-attachments" (use this exact ID)
5. Copy the Bucket ID and update your `.env`:
   ```env
   VITE_APPWRITE_STORAGE_ID=your_storage_bucket_id_here
   ```

### Set Bucket Permissions:
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

## 5. Final Environment Configuration

Your final `.env` file should look like:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id
VITE_APPWRITE_DATABASE_ID=your_actual_database_id
VITE_APPWRITE_STORAGE_ID=your_actual_storage_bucket_id
```

## 6. Testing the Setup

1. Start your development server: `npm run dev`
2. Try to register a new user
3. Create a test task
4. Verify everything works correctly

## Database Schema Reference

### Tasks Collection Schema:
```json
{
  "$id": "string (auto-generated)",
  "title": "string (required)",
  "description": "string (optional)",
  "status": "pending | completed",
  "priority": "low | medium | high",
  "dueDate": "datetime (optional)",
  "tags": "string[] (optional)",
  "attachments": "string[] (optional)",
  "userId": "string (required)",
  "$createdAt": "datetime (auto-generated)",
  "$updatedAt": "datetime (auto-generated)"
}
```

## Troubleshooting

- **401 Unauthorized**: Check your project ID and ensure authentication is properly configured
- **404 Not Found**: Verify your database ID and collection IDs match exactly
- **403 Forbidden**: Check your collection permissions and ensure they allow user access
- **Network errors**: Verify your Appwrite endpoint URL is correct

## Security Notes

- The app uses user-based permissions, so users can only access their own tasks
- File uploads are restricted to authenticated users
- Consider implementing rate limiting in production