# Chapter Cover Images

This folder contains the cover images for each audiobook chapter.

## File Naming Convention

- `chapter-1.jpg` - Cover for Chapter 1 (Pre-Word)
- `chapter-2.jpg` - Cover for Chapter 2 (Vision and Implications...)
- `chapter-3.jpg` - Cover for Chapter 3 (The Underlying Principles)
- ... up to `chapter-24.jpg` (Conclusion and Call to Action)

## Image Requirements

### Recommended Specifications (HORIZONTAL FORMAT)

- **Format**: JPG, PNG, or WebP
- **Dimensions**: 1920x1080px (horizontal, 16:9 ratio) ⬅️ HORIZONTAL
- **Alternative**: 1280x720px (smaller, still 16:9)
- **Size**: < 500KB per image (optimized for web)
- **Color Space**: RGB (sRGB recommended)
- **DPI**: 72 (for web)

### Why Horizontal?

Horizontal covers (16:9) provide better visual experience in the audio player and chapter list, especially on desktop and tablet devices. They also work great on mobile in landscape mode.

### Fallback

If a chapter-specific cover is not available, the system will use the main book cover from `/public/book-cover.jpg`.

## How to Add Chapter Covers

1. **Create your cover images** with the recommended specifications
2. **Name them correctly**: `chapter-X.jpg` where X is the chapter number
3. **Place them in this folder**: `public/chapters/`
4. **Update the configuration** in `lib/audiobook-chapters.ts` if using different names or formats

Example:

```typescript
{
  id: 1,
  title: "Pre-Word",
  // ...
  coverImage: "/chapters/chapter-1.jpg",
}
```

## Image Optimization Tips

### Using ImageMagick

```bash
# Resize and optimize to 1920x1080 (horizontal)
convert input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 chapter-1.jpg

# Batch process all 24 chapters
for i in {1..24}; do
  convert "chapter-$i-original.jpg" -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 "chapter-$i.jpg"
done
```

### Using Online Tools

- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Advanced image optimization
- [Canva](https://www.canva.com/) - Design covers

## Current Chapters

Update this list when adding new chapters:

- [ ] chapter-1.jpg - Pre-Word
- [ ] chapter-2.jpg - Vision and Implications of Decentralisation
- [ ] chapter-3.jpg - The Underlying Principles
- [ ] chapter-4.jpg - The Perfect Storm
- [ ] chapter-5.jpg - Game Theory of Network Attacks
- [ ] chapter-6.jpg - Attack Vectors
- [ ] chapter-7.jpg - Defense Mechanisms
- [ ] chapter-8.jpg - Social Consensus
- [ ] chapter-9.jpg - Technical Stack for Censorship Resistance
- [ ] chapter-10.jpg - Proof of Work vs Delegated Proof of Stake
- [ ] chapter-11.jpg - The Role of Witnesses
- [ ] chapter-12.jpg - Governance Without Central Authority
- [ ] chapter-13.jpg - Economic Incentives
- [ ] chapter-14.jpg - The Steem Takeover Attempt
- [ ] chapter-15.jpg - The Birth of Hive
- [ ] chapter-16.jpg - Community Resilience
- [ ] chapter-17.jpg - Digital Rights and Freedom
- [ ] chapter-18.jpg - Building Network States
- [ ] chapter-19.jpg - The Role of DHF
- [ ] chapter-20.jpg - Layer 2 Solutions and Scalability
- [ ] chapter-21.jpg - The Future of Decentralized Social Media
- [ ] chapter-22.jpg - Practical Implementation Guide
- [ ] chapter-23.jpg - Common Pitfalls and How to Avoid Them
- [ ] chapter-24.jpg - Conclusion and Call to Action

## Notes

- The images will be displayed in the chapter list and in the audio player
- Consistent sizing and style creates a professional look
- Consider adding chapter numbers or titles to the cover images
