import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SkillBridge</h3>
            <p className="text-sm text-muted-foreground">
              Connect with expert tutors and learn anything, anytime.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tutors" className="text-muted-foreground hover:text-primary">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/register?role=STUDENT" className="text-muted-foreground hover:text-primary">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Tutors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register?role=TUTOR" className="text-muted-foreground hover:text-primary">
                  Become a Tutor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
