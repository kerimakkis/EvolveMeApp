# Development Notes

## Console Warnings and Errors

### Known Warnings (Suppressed)

The following warnings are known and have been suppressed as they don't affect functionality:

1. **"shadow*" style props are deprecated**
   - **Cause**: React Native web is deprecating individual shadow properties
   - **Solution**: Replaced with modern `boxShadow` CSS property
   - **Status**: ✅ Fixed in all components

2. **"props.pointerEvents is deprecated"**
   - **Cause**: React Native web deprecating pointerEvents prop
   - **Solution**: Should use `style.pointerEvents` instead
   - **Status**: 🔍 Investigating - may be from third-party libraries

3. **"The message port closed before a response was received"**
   - **Cause**: Browser extension or development tool communication
   - **Solution**: This is typically harmless and related to browser extensions
   - **Status**: ✅ Suppressed - not affecting app functionality

### Error Handling

The app now includes:

1. **Error Boundaries**: Catches React component errors gracefully
2. **Global Error Handlers**: Catches unhandled JavaScript errors
3. **Navigation Error Handling**: Handles navigation-related errors
4. **Console Utilities**: Suppresses known non-critical warnings

### Development Best Practices

1. **Use `boxShadow` instead of individual shadow properties**:
   ```javascript
   // ❌ Deprecated
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,

   // ✅ Modern
   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
   ```

2. **Use `style.pointerEvents` instead of `pointerEvents` prop**:
   ```javascript
   // ❌ Deprecated
   <View pointerEvents="none">

   // ✅ Modern
   <View style={{ pointerEvents: 'none' }}>
   ```

3. **Always wrap async operations in try-catch blocks**:
   ```javascript
   try {
     const result = await apiCall();
   } catch (error) {
     console.log('Error handled:', error);
   }
   ```

### Performance Optimizations

- Error boundaries prevent full app crashes
- Suppressed warnings reduce console noise
- Global error handlers provide better debugging information

### Troubleshooting

If you see new warnings or errors:

1. Check if they're in the suppressed list
2. If not, add them to `frontend/utils/consoleUtils.js`
3. For critical errors, check the error boundary output
4. Use React DevTools for component debugging 