import initTinymce from "./tinymce.mjs";
import initCodeMirror from "./codemirror.mjs";
import initUI from "./ui.mjs";
import "../css/index.css";

function App() {
    initUI();
    initCodeMirror();
    initTinymce();
}

App();