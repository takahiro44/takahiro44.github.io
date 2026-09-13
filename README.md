# Portfolio

React / TypeScript / Vite の静的ポートフォリオサイトです。ビルド時にトップ・プロジェクト詳細・404のHTMLを生成し、常駐サーバーなしで GitHub Pages に公開できます。JavaScriptが無効でも本文とリンクは利用できます。

## ローカル

Node.js 22.12以上を使用します。

```sh
npm ci
npm run dev
npm run lint
npm run format
npm run typecheck
npm run build
npm run preview
```

開発は通常 http://localhost:5173、production preview は http://localhost:4173。ビルド結果は dist/ のみです。

## ディレクトリ

- .prettierrc / .prettierignore: 整形設定。
- src/data/content.ts: プロフィール、Projects、Research、Experience、Skills。
- src/data/types.ts: コンテンツの型。
- src/data/site.ts: タイトル、説明、公開URL、サンプルモード。
- src/components/: 共通表示・ナビ・Projectカード。
- src/App.tsx: トップと詳細ページ。
- src/styles.css: デザイントークン、PC・タブレット・スマートフォン対応。
- public/: 公開する画像、favicon.svg、og.png、任意のCV。
- scripts/prerender.tsx: 静的HTML・OGP・robots・sitemap生成。
- .github/workflows/pages.yml: lint / format:check / typecheck / build とmainからのデプロイ。

## コンテンツ更新

ProjectsにはAI虎の巻、#NASU、Math-App、intro-quizを掲載しています。公開済みのため、site.tsのsampleはfalse（検索インデックス有効）です。

1. content.ts の各値を公開可能な実データへ置換します。
2. Projectを追加する際はprojects配列へ一件追加します。一意のid（例 P-04）から /projects/p-04/ が自動生成されます。idは英数字とハイフンのみとしてください。
3. statusはpublished（通常カード）、preparing（点線・技術メモのみ）、repo-only（Other repositories）。preparingのResultは詳細で表示されません。
4. links.github / links.demo は任意です。未設定ならボタンを表示しません。Researchのコードリンク欄はありません。
5. screenshotとscreenshotAlt、architectureImageとarchitectureAltを対にして設定します。画像はpublic/images/以下へ置き、/images/example.webpのように参照します。未設定時は枠を表示します。
6. teamResultとmyContributionにチーム成果と本人の貢献を分けて記載します。period、technicalChallenges、architectureは詳細で表示されます。
7. SkillsのprojectIdsは既存Projectのidを参照します。技術チップは先頭のProjectへ、用途のリンクからは各Projectへ移動できます。
8. contactsの項目はすべて任意です。resumeはpublic/resume.pdfを置いた後で /resume.pdf を設定します。未設定連絡先は準備中表示です。
9. site.ts のtitle / description / urlを更新し、実データへの置換完了後にsampleをfalseへ変更します。public/og.pngとfavicon.svgも必要に応じて差し替えます。

研究は文章量に応じてカードが伸びます。outputsは発表・論文の配列、technologiesは研究に使った技術です。公開リポジトリ数は有効なリンクのあるrepositoriesの件数です。

## GitHub Pages

1. GitHubに <username>.github.io という名前のリポジトリを用意し、このコードをmainへpushします。
2. Settings → Pages → Build and deployment → SourceをGitHub Actionsにします。
3. mainへのpushで検証後にdistがデプロイされます。PRでは検証のみ実行します。

ユーザーサイトのためbaseは / です。CIは公開メタデータ用のSITE_URLをリポジトリ所有者から設定します。独自ドメインの場合はworkflowのSITE_URLも変更してください。ローカルの公開メタデータ検証ではsite.tsのurl、または公開値の環境変数SITE_URLを指定します。

詳細ページは各ディレクトリのindex.htmlなので直リンク・再読み込みに対応します。公開前はスマートフォン、キーボード操作、各リンク先、画像とOGPを確認してください。

フロントエンドにAPIキー・token・秘密情報を入れないでください。環境変数も埋め込まれれば公開情報です。公開する画像・PDFの内容も確認してください。

デプロイ構成は [Vite公式ガイド](https://vite.dev/guide/static-deploy) と [GitHub Pages公式資料](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) を参照しています。

## ブラウザー検証

Microsoft Edgeのインストール済み環境で、npm run build → npm run previewを起動し、別ターミナルでnpm run verify:browserを実行します。1440 / 1024 / 768 / 390 / 320px、横はみ出し、詳細直リンク、GitHub・デモリンク、キーボード、現在地表示、JavaScript無効時を確認します。画面キャプチャはartifacts/に保存します。公開用のOG画像は上書きしません。

## 文章と文字サイズ

Projectのcardはトップカード用の任意の要約です。未指定項目は元の本文を使用し、詳細ページは元の説明をそのまま表示します。プロフィールのaffiliationは大学名・研究科専攻・学年を構造化して表示します（未設定時はpositionを使用）。本文サイズはstyles.cssの--text-bodyで管理し、PC・スマートフォンともに16px。日本語の項目名はcomponents/ui.tsxのfieldLabelsで管理します。
