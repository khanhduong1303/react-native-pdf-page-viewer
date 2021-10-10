@objc(PdfUtilModule)
class PdfUtilModule: NSObject {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    /**
     * Get the number of pages of a pdf.
     */
    @objc(getPageCount:withResolver:withRejecter:)
    func getPageCount(source: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        let url = URL(fileURLWithPath: source)
        guard let pdf = CGPDFDocument(url as CFURL) else {
            reject("ENOENT", "Unable to read pdf \(source)", nil)
            return
        }
        resolve(pdf.numberOfPages)
    }

    /**
     * Get the dimensions of every page.
     */
    @objc(getPageSizes:withResolver:withRejecter:)
    func getPageSizes(source: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let url = URL(fileURLWithPath: source)
        guard let pdf = CGPDFDocument(url as CFURL) else {
            reject("ENOENT", "Unable to read pdf \(source)", nil)
            return
        }

        // Read dimensions (in pdf units) of all pages.
        var pages: [[String: CGFloat]] = []
        // CGPDFDocument pages are 1-indexed.
        for pageNum in 1...pdf.numberOfPages {
            guard let pdfPage = pdf.page(at: pageNum) else {
                reject(nil, "Unable to read pdf page \(pageNum)", nil)
                return
            }

            let pageBounds = pdfPage.getBoxRect(.cropBox)
            let pageHeight: CGFloat
            let pageWidth: CGFloat
            if pdfPage.rotationAngle % 180 == 90 {
                pageHeight = pageBounds.width
                pageWidth = pageBounds.height
            } else {
                pageHeight = pageBounds.height
                pageWidth = pageBounds.width
            }

            pages.append([
                "height": pageHeight,
                "width": pageWidth
            ])
        }
        resolve(pages)
    }
    
    @objc(getBase64Image:withPage:withResolver:withRejecter:)
    func getBase64Image(source: String, page: Int ,resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        var base64 = ""
        let url = URL(fileURLWithPath: source)
        guard let pdf = CGPDFDocument(url as CFURL) else {
            reject("ENOENT", "Failed to open '\(source)' for reading.", nil)
            return
        }
        guard let pdfPage = pdf.page(at: page + 1) else {
            reject("ENOENT", "Failed to open page '\(page)' of '\(source)' for reading.", nil)
            return
        }
        let pageRect = pdfPage.getBoxRect(.mediaBox)
        
        if #available(iOS 10.0, *) {
            let renderer = UIGraphicsImageRenderer(size: pageRect.size)
            let img = renderer.image { ctx in
                UIColor.white.set()
                ctx.fill(pageRect)

                ctx.cgContext.translateBy(x: 0.0, y: pageRect.size.height)
                ctx.cgContext.scaleBy(x: 1.0, y: -1.0)

                ctx.cgContext.drawPDFPage(pdfPage)
            }
           let jpegData = img.jpegData(compressionQuality: 1)
            base64 = (jpegData?.base64EncodedString())!
        } else {
            // Fallback on earlier versions
        }
        
        resolve(base64)
    }

    /**
     * Get the isLocked of a pdf.
     */
    @objc(isLocked:withResolver:withRejecter:)
    func isLocked(source: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        let url = URL(fileURLWithPath: source)
        guard let pdf = CGPDFDocument(url as CFURL) else {
            reject("ENOENT", "Unable to read pdf \(source)", nil)
            return
        }
        resolve(!pdf.isUnlocked)
    }
}
