import { hydrateRoot, createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
const root = document.getElementById('root')!;
const path = window.location.pathname;
const view = <App path={path} />;
if (root.hasChildNodes()) hydrateRoot(root, view);
else createRoot(root).render(view);
