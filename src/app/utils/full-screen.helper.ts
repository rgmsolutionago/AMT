interface FsDocument extends HTMLDocument {
  fullscreenElement: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface FsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

export class FullScreenHelper {
  // Based on https://stackoverflow.com/questions/48995303/fullscreen-request-on-angular-2-4?rq=1#answer-48995593 idea

  private static isFullScreen(): boolean {
    const fsDoc = document as FsDocument;
    return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.webkitFullscreenElement || fsDoc.msFullscreenElement);
  }

  public static launchFullScreen(): void {
    if (this.isFullScreen())
      return;

    const fsDocElem = document.documentElement as FsDocumentElement;
    if (fsDocElem.requestFullscreen)
      fsDocElem.requestFullscreen();
    if (fsDocElem.msRequestFullscreen)
      fsDocElem.msRequestFullscreen();
    if (fsDocElem.mozRequestFullScreen)
      fsDocElem.mozRequestFullScreen();
    if (fsDocElem.webkitRequestFullscreen)
      fsDocElem.webkitRequestFullscreen();
  }

}
