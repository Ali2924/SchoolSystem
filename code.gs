// تكوين المتغيرات العامة
const SPREADSHEET_ID = '1BI86tqa-BhCx2BiDN4XtG72xRL_sumDUms4gUuAgq8g'; // استبدل بمعرف جدول البيانات الخاص بك
const SHEET_NAME = 'users';
const SCHOOL_WEBSITE_URL = 'https://www.0zz0.com'; // استبدل برابط موقع المدرسة الخاص بك
const EMAIL_SUBJECT = 'استرجاع كلمة المرور';

// دالة لعرض صفحة تسجيل الدخول
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('نظام تسجيل الدخول')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// دالة للتحقق من بيانات تسجيل الدخول
function validateLogin(username, password) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // البحث عن المستخدم في جدول البيانات
    for (let i = 1; i < data.length; i++) { // نبدأ من 1 لتخطي الصف الأول (العناوين)
      if (data[i][0] === username && data[i][1] === password) {
        return {
          success: true,
          fullName: data[i][2],
          redirectUrl: SCHOOL_WEBSITE_URL
        };
      }
    }
    
    // إذا لم يتم العثور على المستخدم
    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  } catch (error) {
    return { success: false, message: 'حدث خطأ: ' + error.toString() };
  }
}

// دالة لاسترجاع كلمة المرور
function recoverPassword(username, email) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // البحث عن المستخدم في جدول البيانات
    for (let i = 1; i < data.length; i++) {
      // التحقق من اسم المستخدم والبريد الإلكتروني
      if (data[i][0] === username && data[i][3] === email) {
        // إرسال كلمة المرور إلى البريد الإلكتروني
        const password = data[i][1];
        const fullName = data[i][2];
        
        const emailBody = `
          <div dir="rtl">
            <p>مرحباً ${fullName}،</p>
            <p>لقد طلبت استرجاع كلمة المرور الخاصة بك.</p>
            <p>اسم المستخدم: <strong>${username}</strong></p>
            <p>كلمة المرور: <strong>${password}</strong></p>
            <p>يرجى تغيير كلمة المرور الخاصة بك بعد تسجيل الدخول للحفاظ على أمان حسابك.</p>
            <p>مع أطيب التحيات،<br>إدارة المدرسة</p>
          </div>
        `;
        
        GmailApp.sendEmail(
          email,
          EMAIL_SUBJECT,
          "يرجى استخدام عميل بريد إلكتروني يدعم HTML لعرض هذه الرسالة.",
          { htmlBody: emailBody }
        );
        
        return { success: true, message: 'تم إرسال كلمة المرور إلى بريدك الإلكتروني' };
      }
    }
    
    // إذا لم يتم العثور على المستخدم
    return { success: false, message: 'لم يتم العثور على حساب بهذه البيانات' };
  } catch (error) {
    return { success: false, message: 'حدث خطأ: ' + error.toString() };
  }
}
