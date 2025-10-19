# Deployment Guide for Appwrite Cloud Sites

This guide will help you deploy your Personal Task Manager to Appwrite Cloud Sites.

## Prerequisites

1. Your Appwrite project is fully configured (database, storage, authentication)
2. Your application is working locally
3. You have admin access to your Appwrite project

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Make sure your `.env` file has the correct production values:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_production_project_id
VITE_APPWRITE_DATABASE_ID=your_production_database_id
VITE_APPWRITE_STORAGE_ID=your_production_storage_id
```

### 3. Build for Production
```bash
npm run build
```

This will create a `dist` folder with all the optimized files.

### 4. Verify Build
```bash
npm run preview
```

Test the production build locally to ensure everything works correctly.

## Deployment to Appwrite Cloud Sites

### Method 1: Appwrite Console (Recommended)

1. **Open Appwrite Console**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io)
   - Navigate to your project

2. **Access Hosting**
   - Click on "Hosting" in the left sidebar
   - If this is your first deployment, you'll see the hosting setup

3. **Upload Your Build**
   - Click "Create Deployment" or "Upload"
   - Drag and drop your `dist` folder or select it
   - Alternatively, upload a ZIP file of the `dist` folder contents

4. **Configure Domain**
   - Set up your custom domain or use the provided Appwrite subdomain
   - Configure SSL (automatically handled by Appwrite)

5. **Deploy**
   - Click "Deploy" to publish your application
   - Wait for the deployment to complete

### Method 2: CLI Deployment

1. **Install Appwrite CLI**
   ```bash
   npm install -g appwrite-cli
   ```

2. **Login to Appwrite**
   ```bash
   appwrite login
   ```

3. **Initialize Project**
   ```bash
   appwrite init project
   ```

4. **Deploy**
   ```bash
   appwrite deploy hosting
   ```

## Post-Deployment Checklist

### 1. Test Core Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Tasks can be created, edited, and deleted
- [ ] File uploads work correctly
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile

### 2. Verify Appwrite Configuration
- [ ] Authentication is working
- [ ] Database operations are functional
- [ ] File storage is accessible
- [ ] All permissions are correctly set

### 3. Performance Optimization
- [ ] Check loading times
- [ ] Verify images and assets load correctly
- [ ] Test on different devices and browsers

## Domain Configuration

### Custom Domain Setup
1. In Appwrite Console, go to Hosting
2. Click "Custom Domains"
3. Add your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate generation

### DNS Configuration
Add the following DNS records to your domain provider:

```
Type: CNAME
Name: www (or your subdomain)
Value: [Your Appwrite hosting URL]
```

## Troubleshooting

### Common Issues

**Build Fails**
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check for environment variable issues

**App Doesn't Load**
- Verify all environment variables are correct
- Check browser console for errors
- Ensure Appwrite project configuration matches

**Authentication Issues**
- Verify project ID is correct
- Check if domain is added to Appwrite project settings
- Ensure authentication methods are enabled

**Database/Storage Errors**
- Verify database and storage IDs
- Check collection and bucket permissions
- Ensure collections have proper schema

### Performance Issues
- Enable compression in Appwrite hosting settings
- Optimize images and assets
- Check for large bundle sizes

## Environment Variables Checklist

Make sure these are set correctly for production:

```env
# Required - Replace with your actual values
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_STORAGE_ID=your_storage_id
```

## Final Steps

1. **Update README**
   - Add your live demo URL
   - Update screenshots with actual application

2. **Share Your Project**
   - Submit to Appwrite Hackathon
   - Share on social media
   - Add to your portfolio

3. **Monitor Usage**
   - Check Appwrite analytics
   - Monitor for errors and performance
   - Gather user feedback

## Support

If you encounter issues during deployment:

1. Check the [Appwrite Documentation](https://appwrite.io/docs)
2. Visit the [Appwrite Discord Community](https://discord.gg/appwrite)
3. Review the [deployment troubleshooting guide](https://appwrite.io/docs/products/hosting/deployment)

---

**Congratulations! Your Personal Task Manager is now live! 🎉**