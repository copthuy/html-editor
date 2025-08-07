import initTinymce from "./tinymce.mjs";
import initCodeMirror from "./codemirror.mjs";
import initUI from "./ui.mjs";

function App() {
    initUI();
    initCodeMirror();
    initTinymce();
}

App();