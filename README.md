# Interactive Solar System Visualization

A detailed, interactive 3D visualization of our solar system built with Three.js. This project features accurate planetary rotations, orbits, and detailed information cards for each celestial body.

![ss](https://github.com/user-attachments/assets/a3dc3d5a-1e97-4a83-ba18-cb5d30870a58)

## Features

- Realistic 3D models of all planets, the Sun, and Earth's Moon
- Accurate rotation speeds and orbital periods (scaled for visualization)
- Interactive information cards with facts about each celestial body
- Realistic textures and atmospheric effects
- Mobile-responsive design
- Loading screen with progress indicator
- Smooth camera transitions and controls

## Technical Details

### Planet Properties
- Accurate size ratios between celestial bodies
- Realistic rotation speeds relative to Earth
- Proper orbital distances (scaled for visualization)
- Atmospheric effects for applicable planets
- Saturn's rings with realistic transparency and texture

### Rotation Speed Multipliers (Earth = 1.0)
- Mercury: 0.017 (58.6 Earth days)
- Venus: -0.004 (-243 Earth days, retrograde rotation)
- Earth: 1.0 (24 hours)
- Mars: 0.973 (24.6 hours)
- Jupiter: 2.4 (10 hours)
- Saturn: 2.3 (10.7 hours)
- Uranus: -1.4 (-17.2 hours, retrograde rotation)
- Neptune: 1.5 (16 hours)
- Sun: 0.037 (27 Earth days)

### Orbital Speed Multipliers (Earth = 1.0)
- Mercury: 1.6
- Venus: 1.17
- Earth: 1.0
- Mars: 0.81
- Jupiter: 0.45
- Saturn: 0.336
- Uranus: 0.236
- Neptune: 0.19

## Technologies Used

- Three.js for 3D rendering
- Custom shaders for atmospheric effects
- Responsive design for mobile compatibility
- High-resolution planet textures (up to 8K)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solar-system-visualization.git](https://github.com/etkey/3D-Solar-System-Three.js.git
```

2. Navigate to the project directory:
```bash
cd 3D-Solar-System-Three.js
```

3. Install and run using npx:
```bash
npx vite
```

4. For development:
```bash
npx vite dev
```

5. To build for production:
```bash
npx vite build
```

6. To preview the production build:
```bash
npx vite preview
```

## Usage

- Click on any celestial body to focus the camera on it
- Click the expanded card or empty space to return to the solar system view
- Use mouse/touch controls to rotate and zoom:
  - Left click/touch drag to rotate
  - Right click/touch drag to pan
  - Scroll/pinch to zoom
- Navigate through facts using the arrow buttons on information cards

![ss2](https://github.com/user-attachments/assets/2835b085-354b-4d95-bc3a-a1d43560366a)

## Features in Detail

### Planet Information Cards
- Basic information including:
  - Diameter
  - Distance from Sun
  - Orbital Period
  - Temperature
  - Brief description
- Multiple interesting facts for each celestial body
- Navigation between facts
- Responsive positioning based on screen size

### Visual Effects
- Realistic planet textures
- Atmospheric effects for planets with atmospheres
- Saturn's ring system
- Earth's cloud layer with independent rotation
- Earth's night lights
- Sun's glow effect

### Camera Controls
- Smooth transitions when focusing on planets
- Orbital controls for free navigation
- Automatic distance adjustment based on object size
- Reset functionality to return to default view

## Performance Optimization

- Texture loading progress tracking
- Efficient geometry usage
- Optimized render loop
- Mobile-specific optimizations
- Progressive loading of assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
