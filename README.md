# Cup_ball_Suffle_Game
# 🎩 Cup Shuffle

Find the hidden ball — watch carefully, then pick a cup!  
A polished, touch-friendly web game with scoring, streaks, confetti, and a persistent high score.

---

## Features

- **Responsive & Mobile-Optimized:** Smooth play on desktop and mobile, with finger-friendly controls and performance tweaks for touch devices.
- **Scoreboard:** Tracks your score (based on streak), total wins, rounds played, and your all-time high score (stored in localStorage).
- **Streaks:** Consecutive correct guesses increase your streak and score. Streak badge pulses with every win!
- **Confetti & Celebration:** Find the ball and enjoy animated confetti bursts and a quick jingle.
- **Touch polish:** Instant tap feedback, increased hit areas, and reduced animation load for mobile.
- **"Made by vishalsingh" badge** at the bottom, linking to [Vishal-singh2's GitHub](https://github.com/Vishal-singh2).

---

## How To Play

1. **Start a new round**  
   Press **New Round** to begin. Watch where the ball is for a moment.

2. **Shuffle the cups**  
   Press **Shuffle**. The cups will move around quickly.

3. **Pick a cup**  
   Tap or click any cup to guess where the ball is hidden.

4. **Scoring**  
   - Correct guess: your streak and score increase (score = streak × 10).
   - Wrong guess: streak and score reset to zero.
   - Beat your high score for extra confetti and a badge pulse.

5. **Repeat!**  
   Press **New Round** to keep playing and try for a new high score.

---

## Installation & Usage

1. **Download the files**  
   - `index.html`
   - `Suffle.css`
   - `script.js`
   

2. **Open locally**  
   Double-click `index.html` or serve the folder with a simple server.

   Example (Python 3):
   ```sh
   python -m http.server 8000
   ```
   Then visit [http://localhost:8000](http://localhost:8000) in your browser.

3. **Play on your phone**  
   - Make sure your computer and phone are on the same Wi-Fi.
   - Find your computer's IP address (e.g., `192.168.1.12`).
   - Visit `http://<your-ip>:8000` on your phone.

4. **(Optional) Deploy**  
   - Host on [GitHub Pages](https://pages.github.com/) for a public URL.
   - Or use [ngrok](https://ngrok.com/) to share a temporary online link.

---

## Customization

- Change the colors, number of cups, or add more audio/visual effects in the HTML/CSS/JS.
- The "Made by vishalsingh" badge: edit the `<a class="made-by">...</a>` in your HTML to personalize further.

---

## Credits

Made by [vishalsingh](https://github.com/Vishal-singh2)  
Confetti & UI logic inspired by modern casual web games.

---

## License

MIT — Feel free to use, remix, and share!

