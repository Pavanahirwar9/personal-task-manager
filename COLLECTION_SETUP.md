# URGENT: Database Collection Setup Required

**You MUST set up the database collection first for the app to work.**

## Steps to Fix the App:

### 1. Go to Appwrite Console
https://nyc.cloud.appwrite.io/console/project-68eb93bd001d103c48c5

### 2. Navigate to Database
- Click "Databases" in the sidebar
- Click on your database (ID: 68eb93e1001215592616)

### 3. Delete Existing Collection (if any)
- If you see a "tasks" collection, delete it completely
- We need to start fresh with correct attributes

### 4. Create New Collection
- Click "Create Collection"
- **Collection ID**: `tasks` (must be exactly this)
- **Collection Name**: `Tasks`

### 5. Add Attributes (EXACTLY as listed):

**String Attributes:**
1. **title** - String, Size: 200, Required: ✅, Array: ❌
2. **description** - String, Size: 1000, Required: ❌, Array: ❌  
3. **status** - String, Size: 20, Required: ✅, Default: `pending`, Array: ❌
4. **priority** - String, Size: 20, Required: ✅, Default: `medium`, Array: ❌
5. **userId** - String, Size: 50, Required: ✅, Array: ❌
6. **dueDate** - String, Size: 50, Required: ❌, Array: ❌
7. **tags** - String, Size: 100, Required: ❌, Array: ✅
8. **attachments** - String, Size: 500, Required: ❌, Array: ✅

### 6. Set Permissions
- **Read Access**: Add `user:*`
- **Create Access**: Add `user:*`  
- **Update Access**: Add `user:*`
- **Delete Access**: Add `user:*`

### 7. Create Index
- Go to "Indexes" tab
- Click "Create Index"
- **Index Key**: `userId_index`
- **Attribute**: `userId`
- **Order**: `ASC`

## After Setup:
1. Refresh your browser at http://localhost:5173/
2. Click "Test Task Creation" - should work now!
3. Try creating real tasks through the form

**The app will not work until this collection is set up correctly!**

export const COLLECTION_SCHEMA = {
  collectionId: 'tasks',
  name: 'Tasks',
  attributes: [
    { key: 'title', type: 'string', size: 200, required: true },
    { key: 'description', type: 'string', size: 1000, required: false },
    { key: 'status', type: 'string', size: 20, required: true, default: 'pending' },
    { key: 'priority', type: 'string', size: 20, required: true, default: 'medium' },
    { key: 'userId', type: 'string', size: 50, required: true },
    { key: 'dueDate', type: 'string', size: 50, required: false },
    { key: 'tags', type: 'string', size: 100, array: true, required: false },
    { key: 'attachments', type: 'string', size: 500, array: true, required: false }
  ],
  permissions: ['user:*'],
  indexes: [
    { key: 'userId_index', attributes: ['userId'], orders: ['ASC'] }
  ]
};