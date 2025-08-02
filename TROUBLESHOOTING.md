# Troubleshooting Guide

This guide helps you resolve common issues you might encounter when running the Rubik's Cube Solver application.

## Common Installation Issues

### 1. "Module not found" Errors

**Problem**: Error messages like "Cannot find module 'react'" or "Cannot find module 'three'"

**Solution**:
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### 2. Permission Errors During Installation

**Problem**: EACCES permission errors when running npm install

**Solution**:
```bash
# Use sudo (Linux/Mac)
sudo npm install

# Or fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### 3. Node.js Version Compatibility

**Problem**: Errors related to Node.js version incompatibility

**Solution**:
```bash
# Check Node.js version
node --version

# Update Node.js to version 16 or higher
# Download from https://nodejs.org/
```

## Runtime Issues

### 1. Blank Screen or White Screen

**Problem**: Application loads but nothing is displayed

**Solution**:
1. Check browser console for JavaScript errors (F12)
2. Verify all dependencies are installed:
   ```bash
   npm list react three @react-three/fiber @react-three/drei
   ```
3. Restart development server:
   ```bash
   npm run dev
   ```

### 2. 3D Visualization Not Working

**Problem**: Cube doesn't render or shows black screen

**Solution**:
1. Ensure WebGL is enabled in your browser
2. Check for WebGL compatibility:
   ```javascript
   // In browser console
   console.log(!!window.WebGLRenderingContext);
   ```
3. Update graphics drivers
4. Try a different browser (Chrome, Firefox, Edge recommended)

### 3. Slow Performance

**Problem**: Application is sluggish or animations are choppy

**Solution**:
1. Close other applications to free up memory
2. Check browser performance in Task Manager
3. Reduce browser zoom level (Ctrl+0 to reset)
4. Disable browser extensions temporarily
5. Use development build instead of production:
   ```bash
   npm run dev
   ```

### 4. Cube Not Solving

**Problem**: "Solve" button doesn't work or cube doesn't solve

**Solution**:
1. Check browser console for errors
2. Ensure cube state is valid (correct number of each color)
3. Refresh the page and try again
4. Try a different scramble

## Development Issues

### 1. Hot Reload Not Working

**Problem**: Changes to code don't reflect in browser

**Solution**:
1. Restart development server:
   ```bash
   npm run dev
   ```
2. Check for syntax errors in your code
3. Clear browser cache (Ctrl+Shift+Delete)

### 2. Port Already in Use

**Problem**: Error "Port 3000 is already in use"

**Solution**:
1. Kill the process using port 3000:
   ```bash
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Or use a different port:
   ```bash
   # In vite.config.js
   export default defineConfig({
     server: {
       port: 3001  // Change port
     }
   });
   ```

### 3. Build Errors

**Problem**: "npm run build" fails with errors

**Solution**:
1. Check for syntax errors in your code
2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
3. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

## Browser Compatibility

### Supported Browsers
- Chrome 64+
- Firefox 62+
- Safari 12+
- Edge 79+

### Unsupported Browsers
- Internet Explorer
- Opera Mini
- Older versions of mobile browsers

## Mobile Device Issues

### 1. Touch Controls Not Working

**Problem**: Orbit controls don't respond to touch

**Solution**:
1. Ensure touch events are enabled in browser
2. Check for JavaScript errors in mobile browser console
3. Try a different mobile browser

### 2. Layout Issues on Mobile

**Problem**: UI elements overlap or are cut off

**Solution**:
1. Rotate device to landscape mode
2. Zoom out (pinch or Ctrl+-)
3. Clear browser cache

## Network Issues

### 1. localhost Not Loading

**Problem**: Browser shows "This site can't be reached"

**Solution**:
1. Check if development server is running:
   ```bash
   npm run dev
   ```
2. Try different address:
   - http://localhost:3000
   - http://127.0.0.1:3000
   - http://[::1]:3000

### 2. Slow Initial Load

**Problem**: First load takes a long time

**Solution**:
1. Check internet connection
2. Wait for initial build to complete
3. Check for antivirus/firewall interference

## Debugging Tools

### Browser Developer Tools
1. Open with F12 or Ctrl+Shift+I
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Elements tab to inspect HTML

### Vite Debug Mode
```bash
# Run with debug information
npm run dev -- --debug
```

### Node.js Debugging
```bash
# Enable Node.js debugging
export DEBUG=* npm run dev
```

## Performance Monitoring

### Browser Performance Tab
1. Open Developer Tools
2. Go to Performance tab
3. Record while using application
4. Analyze CPU and memory usage

### Memory Leaks Detection
1. Take heap snapshots in Memory tab
2. Compare snapshots over time
3. Look for continuously growing object counts

## Reporting Issues

When reporting issues, please include:
1. Error messages from browser console
2. Browser name and version
3. Operating system and version
4. Node.js and npm versions
5. Steps to reproduce the issue
6. Screenshots if applicable

### Getting Version Information
```bash
# Node.js version
node --version

# npm version
npm --version

# Browser information
# Chrome: chrome://version
# Firefox: about:support
```

## Additional Resources

1. **React Documentation**: https://reactjs.org/
2. **Three.js Documentation**: https://threejs.org/
3. **Vite Documentation**: https://vitejs.dev/
4. **Node.js Troubleshooting**: https://nodejs.org/en/docs/
5. **Browser Compatibility**: https://caniuse.com/

If you continue to experience issues after trying these solutions, please open an issue on the project repository with detailed information about the problem you're experiencing.