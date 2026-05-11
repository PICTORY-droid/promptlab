import GoogleLoginButton from "./GoogleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";

export default function SocialLoginButtons() {
  return (
    <div className="grid gap-2">
      <GoogleLoginButton />
      <KakaoLoginButton />
    </div>
  );
}
