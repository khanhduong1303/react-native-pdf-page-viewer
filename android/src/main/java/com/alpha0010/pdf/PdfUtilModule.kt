package com.alpha0010.pdf

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.*
import java.util.concurrent.locks.Lock
import kotlin.concurrent.withLock

class PdfUtilModule(reactContext: ReactApplicationContext, private val pdfMutex: Lock) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RNPdfUtil"
    }

    /**
     * Get the number of pages of a pdf.
     */
    @ReactMethod
    fun getPageCount(source: String, promise: Promise) {
        val file = File(source)
        val fd: ParcelFileDescriptor
        try {
            fd = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
        } catch (e: FileNotFoundException) {
            promise.reject("ENOENT", e)
            return
        }

        val pageCount = pdfMutex.withLock {
            val renderer = try {
                PdfRenderer(fd)
            } catch (e: Exception) {
                fd.close()
                promise.reject(e)
                return
            }
            val res = renderer.pageCount
            renderer.close()
            return@withLock res
        }
        fd.close()

        promise.resolve(pageCount)
    }

    /**
     * Get the dimensions of every page.
     */
    @ReactMethod
    fun getPageSizes(source: String, promise: Promise) {
        val file = File(source)
        val fd = try {
            ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
        } catch (e: FileNotFoundException) {
            promise.reject("ENOENT", e)
            return
        }

        val pageSizes = pdfMutex.withLock {
            val renderer = try {
                PdfRenderer(fd)
            } catch (e: Exception) {
                fd.close()
                promise.reject(e)
                return
            }
            // Read dimensions (in pdf units) of all pages.
            val pages = Arguments.createArray()
            for (pageNum in 0 until renderer.pageCount) {
                val pdfPage = try {
                    renderer.openPage(pageNum)
                } catch (e: Exception) {
                    renderer.close()
                    fd.close()
                    promise.reject(e)
                    return
                }

                val pageDim = Arguments.createMap()
                pageDim.putInt("height", pdfPage.height)
                pageDim.putInt("width", pdfPage.width)
                pages.pushMap(pageDim)

                pdfPage.close()
            }
            renderer.close()
            return@withLock pages
        }
        fd.close()

        promise.resolve(pageSizes)
    }

    @ReactMethod
    fun getBase64Image(source: String, page: Int, promise: Promise) {
        val file = File(source)
        val fd = try {

            ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
        } catch (e: FileNotFoundException) {
            promise.reject(e)
            return
        }
        val base64Image = pdfMutex.withLock {
            val renderer = try {
                PdfRenderer(fd)
            } catch (e: Exception) {
                fd.close()
                promise.reject(e)
                return
            }
            val pdfPage = try {
                renderer.openPage(page)
            } catch (e: Exception) {
                renderer.close()
                fd.close()
                promise.reject(e)
                return
            }

            // Create base 64 image
            val bitmapWidth = pdfPage.width * 3 // reactApplicationContext.resources.displayMetrics.densityDpi / 72 * pdfPage.width
            val bitmapHeight =  pdfPage.height * 3 // reactApplicationContext.resources.displayMetrics.densityDpi / 72 * pdfPage.height
            val bitmap = Bitmap.createBitmap(bitmapWidth, bitmapHeight, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            canvas.drawColor(Color.WHITE)
            canvas.drawBitmap(bitmap, 0f, 0f, null)
            pdfPage.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_PRINT);
            val baos = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos)
            val byteArrays = baos.toByteArray()
            val base64 = Base64.encodeToString(byteArrays, Base64.DEFAULT)
            baos.close()
            pdfPage.close()
            renderer.close()
            return@withLock base64
        }
        fd.close()
        promise.resolve(base64Image)
    }
}
