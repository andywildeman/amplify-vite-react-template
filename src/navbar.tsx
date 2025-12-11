import { useEffect, useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import type { AuthUser } from "aws-amplify/auth";

export default function AppNavbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load current user when navbar mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null); // Not signed in
      }
    };

    loadUser();
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Treasure Hunt</Navbar.Brand>
               
          {/* Auth Buttons */}
          {user ? (
            <Button
              variant="outline-light"
              onClick={() => signOut().then(() => setUser(null))}
            >
              Sign Out
            </Button>
          ) : (
            <Button variant="outline-light" href="/login">
              Sign In
            </Button>
          )}
      </Container>
    </Navbar>
  );
}