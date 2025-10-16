# 🫧 Bubbly Quest

A delightful text-based adventure game engine with a playful, toy-like interface that makes creating and playing adventures fun and accessible for everyone.

![Bubbly Quest Logo](public/tauri.svg)

## ✨ What is Bubbly Quest?

Bubbly Quest is not just a game—it's a complete adventure game engine that lets you:

- **Play immersive text-based adventures** with a rich, interactive command system
- **Create your own adventures** with our intuitive "Fabula Machina" editor
- **Customize your experience** with 10+ beautiful visual themes
- **Enjoy smooth animations** and delightful micro-interactions

With its colorful interface and engaging design, Bubbly Quest brings the classic text adventure genre into the modern age with a focus on joy and accessibility.

## 🎮 Game Features

### Immersive Gameplay
- **Natural Command System**: Type commands like "go north", "take sword", or "attack goblin"
- **Smart Parser**: Understands synonyms, shortcuts, and compound commands
  - Try `n`, `north`, or `forward` for movement
  - Use `get`, `take`, or `grab` for items
  - Combine actions: "take sword and attack goblin"
- **RPG Elements**: Level up your character, gain experience, and improve your stats
- **Turn-based Combat**: Battle monsters with strategic combat mechanics
- **Rich Interactions**: Explore rooms, solve puzzles, and collect items

### Visual Experience
- **10+ Beautiful Themes**: From cheerful "Bubbly Original" to mysterious "Autumn Grimoire"
- **Playful Animations**: Bouncy buttons, typing text effects, and smooth transitions
- **Responsive Interface**: Clean, organized layout with clear sections for:
  - Main text view for story and descriptions
  - Player status panel with HP, XP, and stats
  - Inventory management system
  - Command input with history

### Save System
- **Multiple Save Slots**: Keep different adventures running simultaneously
- **Auto-save Functionality**: Never lose your progress
- **Save Management**: Visual save interface with player stats and timestamps

## 🛠️ Adventure Editor: "Fabula Machina"

Create your own adventures with our powerful yet easy-to-use editor:

### Room Design
- Create interconnected rooms with detailed descriptions
- Set up exits and connections between locations
- Add interactive features and puzzles
- Control lighting and atmosphere

### Item System
- Design various item types: weapons, armor, consumables, keys, treasures
- Set item properties and special effects
- Create custom items with unique behaviors
- Balance rarity and value

### Monster Creation
- Design enemies with unique behaviors and attack patterns
- Set difficulty levels and special abilities
- Configure loot tables and rewards
- Create challenging boss encounters

### Adventure Configuration
- Set victory conditions and objectives
- Configure difficulty and estimated playtime
- Add metadata and descriptions
- Export and share your creations

## 🎨 Themes & Customization

Choose from our collection of carefully crafted themes:

### Light Themes ☀️
- **Bubbly Original** 🫧: Soft creams, pastel blues, and candy pinks
- **Strawberry Sunset** 🍓: Warm pinks, sunny yellows, and mint green
- **Matcha Mochi** 🍵: Soothing soft greens, white, and earthy tones
- **Sakura Spring** 🌸: Cherry blossom pinks, sky blues, and clean whites
- **Cozy Cottage** 🧸: Warm browns, tans, and honey accents

### Dark Themes 🌙
- **Midnight Cozy** 🌃: Deep navy blues, soft lavender, and glowing text
- **Starlight Velvet** ✨: Deep indigo with sparkling gold and silver accents
- **Arcade Night** 👾: Black background with neon magenta, cyan, and lime
- **Autumn Grimoire** 🎃: Deep oranges, rich burgundies, and dark browns
- **Abyssal Tide** 🌊: Dark teals, deep purples, and phosphorescent highlights

## 📥 Installation

### For Windows Users (Recommended)
1. Download the latest release from our [Releases page](https://github.com/iamkaf/bubbly-quest/releases)
2. Run the installer and follow the setup wizard
3. Launch Bubbly Quest from your Start menu or desktop shortcut

### From Source (Developers)
If you want to build from source:

#### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://rustup.rs/) (latest stable)
- Git

#### Build Steps
```bash
# Clone the repository
git clone https://github.com/iamkaf/bubbly-quest.git
cd bubbly-quest

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build
npm run tauri build
```

## 🚀 Getting Started

### Playing Adventures
1. Launch Bubbly Quest
2. Click "Play Adventure" from the main menu
3. Select an adventure from the available options
4. Start exploring by typing commands!

### Creating Your First Adventure
1. Click "Adventure Editor" from the main menu
2. Create a new adventure or load a template
3. Design your rooms, items, and monsters
4. Set up victory conditions
5. Test your adventure and export it

### Customizing Your Experience
1. Go to Settings from the main menu
2. Browse through available themes
3. Select your preferred theme
4. Adjust other settings to your liking

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, improving documentation, or adding new features, we'd love your help.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run checks: `npm run check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a pull request

### Code Style
- Use TypeScript for all new code
- Follow the existing code style (Prettier configuration)
- Add comments for complex logic
- Include tests for new features when applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) for lightweight desktop applications
- Powered by [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Styled with beautiful fonts from [Google Fonts](https://fonts.google.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

## 📞 Get in Touch

- Have questions or feedback? [Open an issue](https://github.com/iamkaf/bubbly-quest/issues)
- Want to share your adventure? We'd love to see what you create!
- Follow our development on [GitHub](https://github.com/iamkaf/bubbly-quest)

---

**Ready to start your adventure? Download Bubbly Quest and begin your journey today!** 🎮✨
