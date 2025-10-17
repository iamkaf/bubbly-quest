# **Bubbly Quest - UI Implementation Plan**

* **Project:** Bubbly Quest UI
* **Version:** 1.0
* **Date:** October 17, 2025
* **Author:** Claude

## **Overview**

This document outlines the complete UI implementation plan for Bubbly Quest, a desktop text-based adventure game frontend that integrates with the external C.H.A.R.G.E. game engine. The UI follows a playful, toy-like aesthetic with heavily rounded corners, micro-animations, and a delightful user experience.

---

## **Phase 1: Setup & Architecture**

### **Objectives**
Establish the foundational architecture and project structure for the UI implementation.

### **Tasks**
- [ ] Install additional dependencies:
  - [ ] phosphor-react for consistent iconography
  - [ ] framer-motion for animations
  - [ ] zustand for UI state management
  - [ ] @phosphor-icons/react for comprehensive icon set
- [ ] Create directory structure:
  - [ ] src/components/ui/ - Base UI components
  - [ ] src/components/screens/ - Screen components
  - [ ] src/components/game/ - Game-specific components
  - [ ] src/components/editor/ - Adventure editor components
  - [ ] src/hooks/ - Custom React hooks
  - [ ] src/types/ - UI type definitions
- [ ] Set up Zustand stores for UI state only:
  - [ ] ThemeStore (theme selection, preferences)
  - [ ] NavigationStore (current screen, routing state)
  - [ ] UIStore (loading states, modals, notifications)
- [ ] Create type definitions:
  - [ ] UI component interfaces
  - [ ] Game state interfaces (matching C.H.A.R.G.E.)
  - [ ] Navigation and routing types
- [ ] Configure path aliases in tsconfig.json and vite.config.ts:
  - [ ] @/components/* -> src/components/*
  - [ ] @/lib/* -> src/lib/*
  - [ ] @/types/* -> src/types/*
  - [ ] @/hooks/* -> src/hooks/*
- [ ] Set up React Router DOM for navigation:
  - [ ] Configure router for Game Player and Adventure Editor
  - [ ] Create route guards and navigation helpers
- [ ] Create basic Layout wrapper:
  - [ ] Responsive layout structure
  - [ ] Theme provider integration
  - [ ] Basic navigation header
- [ ] Test Phase 1 setup:
  - [ ] Verify all dependencies install correctly
  - [ ] Test basic component imports
  - [ ] Ensure TypeScript compilation

### **Deliverables**
- Complete project structure with organized component directories
- Zustand stores for UI state management
- Type definitions for all UI components
- Working React Router setup
- Basic Layout component
- All TypeScript compilation and build checks passing

---

## **Phase 2: Themes & Theme Switcher**

### **Objectives**
Implement a comprehensive theming system with 10 themes (5 light, 5 dark) and smooth theme switching.

### **Tasks**
- [ ] Implement 10 complete themes using Tailwind v4 + shadcn:
  - [ ] Light Themes ☀️
    - [ ] **Bubbly Original** 🫧 - Soft creams, pastel blues, candy pinks
    - [ ] **Strawberry Sunset** 🍓 - Warm pinks, sunny yellows, mint green
    - [ ] **Matcha Mochi** 🍵 - Soft greens, white, earthy tones
    - [ ] **Sakura Spring** 🌸 - Cherry blossom pinks, sky blues, clean whites
    - [ ] **Cozy Cottage** 🧸 - Warm browns, tans, honey accent
  - [ ] Dark Themes 🌙
    - [ ] **Midnight Cozy** 🌃 - Deep navy blues, soft lavender, glowing text
    - [ ] **Starlight Velvet** ✨ - Deep indigo, sparkling gold and silver
    - [ ] **Arcade Night** 👾 - Black background with neon magenta, cyan, lime
    - [ ] **Autumn Grimoire** 🎃 - Deep oranges, rich burgundies, dark browns
    - [ ] **Abyssal Tide** 🌊 - Dark teals, deep purples, phosphorescent highlights
- [ ] Create ThemeSelector component:
  - [ ] Dropdown/selector with theme previews
  - [ ] Smooth theme switching animations
  - [ ] Theme persistence in localStorage
- [ ] Implement CSS Custom Properties system:
  - [ ] OKLCH color space for better color consistency
  - [ ] Semantic color tokens (primary, secondary, muted, etc.)
  - [ ] Theme-specific accent colors and gradients
- [ ] Add theme switching animations:
  - [ ] Smooth color transitions
  - [ ] Component state transitions
  - [ ] Loading states during theme changes
- [ ] Create theme showcase/documentation:
  - [ ] Demonstrate all themes with live preview
  - [ ] Document color values and design decisions
  - [ ] Theme accessibility testing

### **Deliverables**
- 10 complete, working themes with proper color contrast
- ThemeSelector component with smooth switching
- Theme persistence system
- Theme documentation and showcase
- All themes passing accessibility checks

---

## **Phase 3: Complete UI Component Suite**

### **Objectives**
Build a comprehensive library of reusable UI components using Tailwind v4 + shadcn.

### **Core Components**
- [ ] **Button** (Multiple variants via shadcn CLI):
  - [ ] Default, secondary, outline, ghost, link variants
  - [ ] Sizes: sm, default, lg, icon, icon-sm, icon-lg
  - [ ] Loading states and disabled states
  - [ ] Bouncy press animations
  - [ ] Hover and focus effects with wiggle/glow
- [ ] **Card** (via shadcn CLI):
  - [ ] Multiple variants (elevated, outline, filled)
  - [ ] Hover animations
  - [ ] Header, content, footer sections
- [ ] **Container**:
  - [ ] Responsive layout containers
  - [ ] Max-width constraints
  - [ ] Padding and margin utilities
- [ ] **Badge** (via shadcn CLI):
  - [ ] Status badges (success, warning, error, info)
  - [ ] Animated number updates
  - [ ] Glowing effects for important badges
- [ ] **Separator** (via shadcn CLI):
  - [ ] Horizontal and vertical separators
  - [ ] Animated appearance

### **Form Components**
- [ ] **Input** (via shadcn CLI):
  - [ ] Text, password, number, email types
  - [ ] Floating labels and placeholders
  - [ ] Validation states with animations
  - [ ] Icon support
- [ ] **Select** (via shadcn CLI):
  - [ ] Single and multi-select
  - [ ] Search/filter functionality
  - [ ] Custom styling with theme support
- [ ] **Checkbox** (via shadcn CLI):
  - [ ] Custom checkmark animations
  - [ ] Indeterminate state
- [ ] **Radio** (via shadcn CLI):
  - [ ] Custom radio button animations
  - [ ] Group validation
- [ ] **Slider** (via shadcn CLI):
  - [ ] Range sliders with step support
  - [ ] Animated thumb and track
- [ ] **Textarea** (via shadcn CLI):
  - [ ] Auto-resize functionality
  - [ ] Character count with animations

### **Feedback Components**
- [ ] **Dialog** (via shadcn CLI):
  - [ ] Modal dialogs with backdrop
  - [ ] Slide and scale animations
  - [ ] Confirm, alert, and custom content types
- [ ] **Alert** (via shadcn CLI):
  - [ ] Success, warning, error, info variants
  - [ ] Dismissible with animations
- [ ] **Toast** (via shadcn CLI):
  - [ ] Notification system with queue
  - [ ] Slide-in animations
- [ ] **Loading states**:
  - [ ] Spinners, skeleton screens, progress bars
  - [ ] Bouncy loading animations

### **Display Components**
- [ ] **Progress Bar** (via shadcn CLI):
  - [ ] Animated progress with smooth transitions
  - [ ] HP/XP bars with color gradients
  - [ ] Circular and linear variants
- [ ] **Avatar** (via shadcn CLI):
  - [ ] User avatars with fallback
  - [ ] Status indicators
- [ ] **Chip**:
  - [ ] Tag-like components for categorization
  - [ ] Removable with animations
- [ ] **Tooltip** (via shadcn CLI):
  - [ ] Contextual help text
  - [ ] Delayed appearance animations

### **Navigation Components**
- [ ] **Tabs** (via shadcn CLI):
  - [ ] Animated tab switching
  - [ ] Scrollable tab lists
- [ ] **Breadcrumbs**:
  - [ ] Navigation path indicators
  - [ ] Interactive with hover effects
- [ ] **Menu** (via shadcn CLI):
  - [ ] Dropdown and context menus
  - [ ] Animated opening/closing

### **Game-Specific Components**
- [ ] **LogDisplay**:
  - [ ] Auto-scrolling text area
  - [ ] Command history with syntax highlighting
  - [ ] Typewriter text animation
  - [ ] Separate styling for input, output, and error messages
- [ ] **StatBar**:
  - [ ] Animated HP/XP bars
  - [ ] Level progression indicators
  - [ ] Gold and item count displays
- [ ] **InventoryGrid**:
  - [ ] Grid layout for items
  - [ ] Item hover tooltips
  - [ ] Drag and drop functionality (future enhancement)
- [ ] **CommandInput**:
  - [ ] Command input with history navigation (up/down arrows)
  - [ ] Auto-complete suggestions
  - [ ] Input validation feedback

### **Animation Components**
- [ ] **TypewriterText**:
  - [ ] Letter-by-letter text reveal
  - [ ] Configurable typing speed
- [ ] **BouncyButton**:
  - [ ] Enhanced button with bouncy press animation
  - [ ] Customizable bounce intensity
- [ ] **GlowEffect**:
  - [ ] Glowing hover effects for important elements
  - [ ] Pulsing animations

### **Deliverables**
- Complete component library with all variants
- Consistent theming across all components
- Comprehensive animations and micro-interactions
- Component documentation and usage examples
- All components passing TypeScript checks

---

## **Phase 4: Layout, Router & Mock Gameplay**

### **Objectives**
Create the main application layout, navigation system, and a fully functional mock gameplay experience.

### **Tasks**
- [ ] **Layout System**:
  - [ ] Responsive main layout with header, sidebar, content area
  - [ ] Collapsible sidebar for inventory/stats
  - [ ] Adaptive layout for different screen sizes
  - [ ] Smooth layout transitions
- [ ] **Navigation Setup**:
  - [ ] React Router configuration for all screens
  - [ ] Navigation guards and protected routes
  - [ ] Breadcrumb navigation
  - [ ] Keyboard shortcuts for navigation
- [ ] **Main Menu Screen**:
  - [ ] Animated title with sparkle effects
  - [ ] Play Adventure, Adventure Editor, Settings buttons
  - [ ] Adventure selection list (mock data)
  - [ ] New Game/Continue Game options
- [ ] **Game Screen Layout**:
  - [ ] **Header Section**:
    - [ ] Player stats display (HP, Level, Gold, Current Room)
    - [ ] Animated stat bars
    - [ ] Quick action buttons
  - [ ] **Main Game Area**:
    - [ ] Log display with auto-scrolling
    - [ ] Room description area
    - [ ] Context-sensitive information panels
  - [ ] **Side Panel**:
    - [ ] Inventory grid with item tooltips
    - [ ] Quest display with progress
    - [ ] Minimap (grid-based world map)
    - [ ] Quick command buttons
  - [ ] **Bottom Command Area**:
    - [ ] Command input with history navigation
    - [ ] Available commands display
    - [ ] Contextual action buttons
- [ ] **Mock Backend Integration**:
  - [ ] Create mock C.H.A.R.G.E. engine interface
  - [ ] Mock adventure data with rooms, items, monsters
  - [ ] Command processing simulation
  - [ ] State management for mock gameplay
- [ ] **Game Features Implementation**:
  - [ ] Room navigation with descriptions
  - [ ] Item pickup and inventory management
  - [ ] Combat display and animations
  - [ ] Level up notifications
  - [ ] Quest progress tracking
- [ ] **Minimap System**:
  - [ ] Grid-based map rendering
  - [ ] Fog of war for undiscovered areas
  - [ ] Player position indicator
  - [ ] Room connection visualization
- [ ] **Game Over/Win Screens**:
  - [ ] Styled overlays with appropriate messaging
  - [ ] Victory animations and effects
  - [ ] Defeat screen with respawn options
  - [ ] Statistics display
- [ ] **Settings Screen**:
  - [ ] Theme selector with live preview
  - [ ] Audio settings (mock for now)
  - [ ] Gameplay preferences
  - [ ] Accessibility options
- [ ] **Responsive Design**:
  - [ ] Ensure proper scaling on different window sizes
  - [ ] Mobile-friendly layouts
  - [ ] Touch-friendly controls for future mobile support

### **Deliverables**
- Complete application layout system
- Fully functional router and navigation
- Mock gameplay experience with all game modes
- Working minimap and game systems
- Game over/victory screens
- Responsive design implementation
- Mock backend ready for C.H.A.R.G.E. integration

---

## **Phase 5: Adventure Editor (Fabula Machina)**

### **Objectives**
Build a comprehensive adventure editor for creating custom adventures that can be exported for the C.H.A.R.G.E. engine.

### **Tasks**
- [ ] **Editor Layout and Navigation**:
  - [ ] Tabbed interface (Rooms, Items, Monsters, Quests, Events, Settings)
  - [ ] Persistent sidebar with project navigation
  - [ ] Save/Export toolbar
  - [ ] Undo/redo functionality
- [ ] **Project Management**:
  - [ ] New adventure creation wizard
  - [ ] Load existing adventure files
  - [ ] Project metadata editor (title, author, description)
  - [ ] Save/Export functionality
- [ ] **Room Editor**:
  - [ ] Visual grid-based room creator
  - [ ] Room property editor (name, description, atmosphere)
  - [ ] Exit management system (direction-based connections)
  - [ ] Item and monster placement in rooms
  - [ ] Interactive feature creator
  - [ ] Room preview and testing
- [ ] **Item Editor**:
  - [ ] Form-based item creation
  - [ ] Support for all item types (consumable, weapon, armor, key, treasure, misc)
  - [ ] Type-specific property editors
  - [ ] Item rarity and value settings
  - [ ] Icon selection (from Phosphor icons)
- [ ] **Monster Editor**:
  - [ ] Complete monster creation interface
  - [ ] Stats and behavior configuration
  - [ ] AI behavior settings (aggression, attack patterns)
  - [ ] Special attack configuration
  - [ ] Loot table editor
  - [ ] Appearance customization
- [ ] **Quest System Editor**:
  - [ ] Visual quest tree creation
  - [ ] Quest objective configuration
  - [ ] Condition and reward setup
  - [ ] Quest dependency management
- [ ] **Event System Editor**:
  - [ ] Global event creation interface
  - [ ] Condition builder (AND/OR logic)
  - [ ] Action configuration (show message, give item, change state)
  - [ ] Event testing and debugging
- [ ] **Adventure Testing**:
  - [ ] Built-in adventure preview mode
  - [ ] Test the adventure with mock C.H.A.R.G.E. integration
  - [ ] Debug console for event testing
  - [ ] Performance testing tools
- [ ] **Export System**:
  - [ ] Generate adventure.json compatible with C.H.A.R.G.E.
  - [ ] Data validation against C.H.A.R.G.E. schema
  - [ ] Export options (full package, individual files)
  - [ ] Adventure sharing functionality (import/export)
- [ ] **Data Validation**:
  - [ ] Real-time validation against C.H.A.R.G.E. schema
  - [ ] Error highlighting and suggestions
  - [ ] Data integrity checks
  - [ ] Adventure completeness verification

### **Deliverables**
- Complete adventure editor interface
- Visual room and world creation tools
- Comprehensive item and monster editors
- Quest and event creation systems
- Adventure testing and preview functionality
- Export system compatible with C.H.A.R.G.E. engine
- Data validation and error checking

---

## **Technical Requirements & Design Adherence**

### **Design Language**
- **Aesthetic**: Playful, toy-like with heavily rounded corners (border-radius: 1rem+)
- **Animations**: Bouncy buttons (scale transforms), text typing effects, hover wiggles/glow
- **Colors**: Soft color palette with high contrast for accessibility
- **Typography**: Baloo 2 (body text), Rubik Mono One (titles and headers)
- **Spacing**: Generous padding and margins for toy-like appearance
- **Interactions**: All interactive elements should feel pressable and responsive

### **C.H.A.R.G.E. Engine Integration**
- **State Management**: Clean API for connecting to external game engine
- **Type Safety**: Full TypeScript coverage matching C.H.A.R.G.E. interfaces
- **Command Processing**: Handle parser commands and display results
- **Game Modes**: Support for exploration, combat, dialogue, and menu modes
- **Event Handling**: Display game events and narrative outcomes

### **Performance & Quality**
- **Optimizations**: Efficient animations and state updates
- **Accessibility**: Screen reader support, keyboard navigation, ARIA labels
- **Testing**: Component tests for critical UI elements
- **Build**: Tauri-compatible production build
- **Error Handling**: Graceful error states and user feedback

---

## **Risk Mitigation**

### **Technical Risks**
- **Animation Performance**: Test animations on lower-end systems
- **State Management**: Keep Zustand stores optimized and minimal
- **Theme System**: Ensure CSS performance with 10+ themes

### **Design Risks**
- **UI Complexity**: Maintain focus on playful, simple interface
- **Accessibility**: Ensure WCAG compliance with color contrast
- **Animation Overload**: Balance animations with usability

### **Integration Risks**
- **C.H.A.R.G.E. Compatibility**: Test with actual engine package
- **Data Migration**: Ensure save/load functionality works
- **Performance**: Monitor memory usage with large adventures

---

## **Milestone Checkpoints**

### **After Phase 1**
- ✅ Complete project structure and foundation
- ✅ All dependencies installed and configured
- ✅ Basic layout and navigation working

### **After Phase 2**
- ✅ Complete theming system with 10 themes
- ✅ Theme switching functionality
- ✅ Theme documentation and showcase

### **After Phase 3**
- ✅ Complete component library
- ✅ All components themed and animated
- ✅ Component documentation

### **After Phase 4**
- ✅ Fully functional game interface
- ✅ Mock gameplay experience
- ✅ All screens responsive and accessible

### **After Phase 5**
- ✅ Complete adventure editor
- ✅ Export system for C.H.A.R.G.E. compatibility
- ✅ Testing and validation tools

---

## **Success Metrics**

### **Code Quality**
- ✅ TypeScript compilation with no errors
- ✅ ESLint: 0 errors, 0 warnings
- ✅ All components properly typed
- ✅ Comprehensive component tests

### **User Experience**
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation and controls
- ✅ Accessibility compliance (WCAG AA)
- ✅ Responsive design on all screen sizes

### **Functionality**
- ✅ Complete mock gameplay experience
- ✅ Full adventure editor functionality
- ✅ Theme system working perfectly
- ✅ Ready for C.H.A.R.G.E. engine integration

---

**This implementation plan provides a comprehensive roadmap for creating a delightful, feature-rich UI for Bubbly Quest that perfectly complements the C.H.A.R.G.E. game engine while maintaining the playful, toy-like aesthetic that makes the application unique and engaging.**