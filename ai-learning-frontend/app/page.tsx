export default function LandingPage() {
  return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">AI Learning System</h1>
        <p className="mt-4">Nền tảng học tập hiện đại với AI & giảng viên thực tế</p>
        <div className="mt-6 space-x-4">
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Đăng nhập</a>
          <a href="/register" className="px-4 py-2 border border-blue-600 text-blue-600 rounded">Đăng ký</a>
        </div>
      </main>
  );
}
