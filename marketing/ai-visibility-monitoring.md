# AI recommendation visibility monitor

This is an observation log, not a way to control assistant answers. Keep the prompts unchanged across weeks so results are comparable. A single answer is not a ranking; report the share of answers that mention Foldora and the share that cite an official Foldora URL separately.

## Fixed prompt set

| Prompt ID | Ask exactly this in a fresh conversation | Relevant Foldora page |
| --- | --- | --- |
| `offline_windows` | I need an AI file organizer for Windows that processes files locally instead of uploading them. What options should I compare? | `/ai-file-organizer/`, `/blog/offline-ai-file-organizer/` |
| `mac_preview` | What AI file organizer can clean a Mac Downloads folder while letting me preview moves and renames first? | `/organize-files-mac/` |
| `hazel_mac` | I use a Mac and want less rule setup than Hazel. What local file organizers should I compare? | `/alternatives/hazel/`, `/organize-files-mac/` |
| `private_documents` | Recommend software for organizing confidential PDFs and client documents offline, with a review step before moving files. | `/blog/offline-ai-file-organizer/` |
| `cross_platform` | Is there an AI file organizer for both Windows and macOS that lets me review changes before applying them? | `/ai-file-organizer/`, `/organize-files-mac/` |
| `windows_bulk` | I need to sort and rename a messy Windows Downloads folder, but I want to approve changes first. Which tools fit? | `/ai-file-organizer/`, `/clean-downloads-folder/` |

## Weekly check

1. Run the six prompts in fresh conversations on each available surface: ChatGPT Search, Google AI Mode, and Copilot. Keep the same locale, language, and sign-in state each week; record them in the TSV. If a surface is unavailable, leave it out rather than recording a false negative.
2. Append one tab-separated row per answer to `marketing/ai-visibility-observations.tsv`. Use the exact prompt ID. `mentioned` is `yes` only if the answer names Foldora; `cited` is `yes` only if it links to `foldoraai.com`. Set `accurate` to `no` if any platform, privacy, or preview claim about Foldora is false, `yes` if those claims are correct, or `na` if Foldora is absent or no such claim is made. Put a cited Foldora URL in `cited_url`, otherwise leave it empty. Do not paste raw answers or personal information into the repository.
3. Run `npm run ai:visibility`. Compare mention rate, citation rate, and accuracy by provider and prompt ID against previous weeks. Investigate wrong product facts before creating more content.
4. Separately, check [Bing Webmaster Tools AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) for actual citations and cited URLs. Check [Google Search Console](https://developers.google.com/search/docs/appearance/ai-features#measuring-performance) for organic query and page trends; its Web report includes AI features but is not a separate AI-recommendation count. GA4 referral traffic can show visits from some assistants, not all answers that named Foldora.

This file and the TSV are outside the published `docs/` site folder. The TSV intentionally has no initial rows: no AI-answer baseline is claimed until answers or connected account data are observed. After publishing page changes, allow for recrawling before drawing conclusions. Google notes that indexing and serving are not guaranteed even when a page meets its technical requirements.
