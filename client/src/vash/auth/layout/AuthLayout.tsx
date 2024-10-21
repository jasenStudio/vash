import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
interface Props extends PropsWithChildren {}
export const AuthLayout = ({ children }: Props) => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link
              to="sign-in"
              className="underline text-xs hover:text-blue-500 hover:ease-linear duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="sign-up"
              className="underline text-xs hover:text-blue-500 hover:ease-linear duration-300"
            >
              register
            </Link>
          </li>
          <li>
            <Link
              to="accounts/list"
              className="underline text-xs hover:text-blue-500 hover:ease-linear duration-300"
            >
              Account
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};
