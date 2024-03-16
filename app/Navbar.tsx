"use client";
import { Avatar, Container, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { BiBookBookmark } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Skeleton } from "./components";

const Navbar = () => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Analytics", href: "/analytics" },
  ];

  const currentPath = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="border-b px-5 mb-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/">
              <BiBookBookmark />
            </Link>
            <ul className="flex space-x-6">
              {links.map((link) => (
                <li
                  key={link.href}
                  className={classNames({
                    "nav-link": true,
                    "!text-zinc-900": currentPath === link.href,
                  })}
                >
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </Flex>

          {status === "loading" && <Skeleton width="3rem" />}

          {status === "unauthenticated" && (
            <Text
              onClick={() => signIn("google")}
              className="nav-link cursor-pointer"
            >
              Login
            </Text>
          )}

          {status === "authenticated" && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Avatar
                  src={session.user!.image!}
                  fallback="?"
                  size="2"
                  radius="full"
                  className="cursor-pointer"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>
                  <Text size="2">{session.user!.email}</Text>
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <Text>Logout</Text>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;
