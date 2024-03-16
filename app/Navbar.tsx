"use client";
import { Box, Container, Flex } from "@radix-ui/themes";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { BiBookBookmark } from "react-icons/bi";

import Link from "next/link";

const Navbar = () => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Analytics", href: "/analytics" },
  ];

  const currentPath = usePathname();

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
          <Link href="/" className="nav-link">
            Login
          </Link>
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;
