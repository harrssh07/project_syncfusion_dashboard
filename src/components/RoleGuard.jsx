import { useStateContext } from '../contexts/ContextProvider';

// Usage: <RoleGuard allow={["admin","manager"]}>...</RoleGuard>
const RoleGuard = ({ allow = [], children, fallback = null }) => {
  const { role } = useStateContext();
  if (allow.length === 0 || allow.includes(role)) return children;
  return fallback;
};

export default RoleGuard;
