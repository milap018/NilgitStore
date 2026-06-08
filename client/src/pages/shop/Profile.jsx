import {
  Heart,
  Home,
  KeyRound,
  LogOut,
  MapPin,
  PackageCheck,
  Plus,
  ShoppingCart,
  Trash2,
  UserRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { formatMoney } from "../../utils/formatMoney.js";

const menuGroups = [
  {
    title: "MY ORDERS",
    items: [{ id: "orders", label: "Orders", icon: PackageCheck }]
  },
  {
    title: "ACCOUNT SETTINGS",
    items: [
      { id: "details", label: "My details", icon: UserRound },
      { id: "addresses", label: "Manage addresses", icon: MapPin }
    ]
  },
  {
    title: "MY STUFF",
    items: [
      { id: "wishlist", label: "Wishlist", icon: Heart },
      { id: "cart", label: "Cart", icon: ShoppingCart }
    ]
  }
];

const validTabs = menuGroups.flatMap((group) => group.items.map((item) => item.id));

function getInitials(user) {
  const source = user?.name || user?.email || "User";
  const words = source.split(" ").filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getStorageKey(user) {
  return `nilgit-profile-${user?._id || user?.email || "guest"}`;
}

function createAddress() {
  const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now());

  return {
    id,
    personName: "",
    mobileNumber: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  };
}

export default function Profile() {
  usePageTitle("Profile");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, logout } = useAuth();
  const { cartTotal, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const activeTab = validTabs.includes(searchParams.get("tab")) ? searchParams.get("tab") : "details";
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: "",
    gender: "male"
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(getStorageKey(user));

    if (!savedProfile) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        mobileNumber: "",
        gender: "male"
      });
      setAddresses([]);
      return;
    }

    try {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile({
        name: parsedProfile.profile?.name || user?.name || "",
        email: parsedProfile.profile?.email || user?.email || "",
        mobileNumber: parsedProfile.profile?.mobileNumber || "",
        gender: parsedProfile.profile?.gender || "male"
      });
      setAddresses(parsedProfile.addresses || []);
    } catch (error) {
      setAddresses([]);
    }
  }, [user]);

  function saveProfile(nextProfile = profile, nextAddresses = addresses) {
    localStorage.setItem(
      getStorageKey(user),
      JSON.stringify({
        profile: nextProfile,
        addresses: nextAddresses
      })
    );
  }

  function selectTab(tabId) {
    setSearchParams({ tab: tabId });
  }

  function handleProfileChange(event) {
    const nextProfile = { ...profile, [event.target.name]: event.target.value };
    setProfile(nextProfile);
    saveProfile(nextProfile, addresses);
  }

  function handlePasswordChange(event) {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New password and confirm password must match.");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Password change form is ready.");
  }

  function handleAddAddress() {
    const nextAddresses = [...addresses, createAddress()];
    setAddresses(nextAddresses);
    saveProfile(profile, nextAddresses);
  }

  function handleAddressChange(id, field, value) {
    const nextAddresses = addresses.map((address) =>
      address.id === id ? { ...address, [field]: value } : address
    );
    setAddresses(nextAddresses);
    saveProfile(profile, nextAddresses);
  }

  function handleRemoveAddress(id) {
    const nextAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(nextAddresses);
    saveProfile(profile, nextAddresses);
  }

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <aside className="space-y-4 lg:sticky lg:top-20 lg:w-80 lg:shrink-0">
        <div className="flex items-center gap-4 rounded-md border border-gold-100 bg-white p-4 shadow-soft">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-300 bg-gold-100 text-xl font-bold text-gold-800">
            {getInitials(profile)}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-neutral-600">Hello,</p>
            <h1 className="truncate text-lg font-bold">{profile.name || "Nilgit customer"}</h1>
            <p className="truncate text-sm text-neutral-500">{profile.email}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft">
          {menuGroups.map((group) => (
            <div key={group.title} className="border-b border-gold-100 last:border-b-0">
              <p className="px-5 py-4 text-xs font-bold uppercase tracking-normal text-neutral-500">{group.title}</p>
              <div className="pb-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`flex h-12 w-full items-center gap-3 px-5 text-left text-sm font-semibold transition ${
                        isActive ? "bg-gold-50 text-gold-800" : "text-neutral-700 hover:bg-gold-50/60"
                      }`}
                      onClick={() => selectTab(item.id)}
                    >
                      <Icon size={18} className={isActive ? "text-gold-700" : "text-neutral-500"} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 px-5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-[640px] flex-1 rounded-md border border-gold-100 bg-white p-6 shadow-soft lg:min-w-0">
        {activeTab === "details" && (
          <div className="max-w-4xl">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="mt-1 text-sm text-neutral-600">Manage your name, email, mobile number, and password.</p>
              </div>
              <span className="w-fit rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
                {isAdmin ? "Admin account" : "Customer account"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input id="profileName" label="Full name" name="name" value={profile.name} onChange={handleProfileChange} />
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Your gender</span>
                <div className="flex h-11 items-center gap-6 rounded-md border border-gold-200 bg-white px-3">
                  {["male", "female"].map((gender) => (
                    <label key={gender} className="flex items-center gap-2 text-sm capitalize text-neutral-700">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={profile.gender === gender}
                        onChange={handleProfileChange}
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold">Email Address</h3>
                <div className="mt-3 max-w-md">
                  <Input id="profileEmail" label="Email" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">Mobile Number</h3>
                <div className="mt-3 max-w-md">
                  <Input
                    id="profileMobile"
                    label="Mobile number"
                    name="mobileNumber"
                    value={profile.mobileNumber}
                    onChange={handleProfileChange}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-8 rounded-md border border-gold-100 bg-gold-50/50 p-5">
              <div className="flex items-center gap-2">
                <KeyRound className="text-gold-700" size={20} />
                <h3 className="text-lg font-bold">Change Password</h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Input
                  id="currentPassword"
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
                <Input
                  id="newPassword"
                  label="New password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
                <Input
                  id="confirmPassword"
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="submit">Save password</Button>
                {message && <p className="text-sm font-semibold text-gold-700">{message}</p>}
              </div>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-bold">FAQs</h3>
              <div className="mt-3 space-y-4 text-sm text-neutral-700">
                <div>
                  <p className="font-semibold">What happens when I update my email address or mobile number?</p>
                  <p className="mt-1">
                    This frontend saves your account display details locally for now. Backend profile update APIs can be connected later.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Can I change my password here?</p>
                  <p className="mt-1">
                    The form is ready for the user experience. The actual password update endpoint can be added in the backend next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">Manage Addresses</h2>
                <p className="mt-1 text-sm text-neutral-600">Add multiple delivery addresses with receiver name and mobile number.</p>
              </div>
              <Button className="gap-2" onClick={handleAddAddress}>
                <Plus size={17} />
                Add address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="mt-6 rounded-md border border-gold-100 bg-gold-50/50 p-8 text-center">
                <Home className="mx-auto text-gold-700" size={30} />
                <p className="mt-3 font-semibold">No address added yet</p>
                <p className="mt-1 text-sm text-neutral-600">Create your first delivery address.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {addresses.map((address, index) => (
                  <article key={address.id} className="rounded-md border border-gold-100 bg-gold-50/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold">Address {index + 1}</h3>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gold-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        onClick={() => handleRemoveAddress(address.id)}
                        aria-label={`Remove address ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Input
                        id={`personName-${address.id}`}
                        label="Person name"
                        value={address.personName}
                        onChange={(event) => handleAddressChange(address.id, "personName", event.target.value)}
                      />
                      <Input
                        id={`mobileNumber-${address.id}`}
                        label="Mobile number"
                        value={address.mobileNumber}
                        onChange={(event) => handleAddressChange(address.id, "mobileNumber", event.target.value)}
                      />
                      <Input
                        id={`addressLine-${address.id}`}
                        label="Address"
                        value={address.addressLine}
                        onChange={(event) => handleAddressChange(address.id, "addressLine", event.target.value)}
                      />
                      <Input
                        id={`city-${address.id}`}
                        label="City"
                        value={address.city}
                        onChange={(event) => handleAddressChange(address.id, "city", event.target.value)}
                      />
                      <Input
                        id={`state-${address.id}`}
                        label="State"
                        value={address.state}
                        onChange={(event) => handleAddressChange(address.id, "state", event.target.value)}
                      />
                      <Input
                        id={`postalCode-${address.id}`}
                        label="Postal code"
                        value={address.postalCode}
                        onChange={(event) => handleAddressChange(address.id, "postalCode", event.target.value)}
                      />
                    </div>
                  </article>
                ))}
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-dashed border-gold-300 bg-white px-4 py-3 text-sm font-semibold text-gold-800 transition hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-100"
                  onClick={handleAddAddress}
                >
                  <Plus size={18} />
                  Add another address
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold">My Orders</h2>
            <p className="mt-1 text-sm text-neutral-600">Order history and tracking will stay inside this account panel.</p>
            <div className="mt-6 rounded-md border border-gold-100 bg-gold-50/50 p-6">
              <PackageCheck className="text-gold-700" size={32} />
              <h3 className="mt-3 text-lg font-bold">Order tracking coming next</h3>
              <p className="mt-2 text-sm text-neutral-600">
                In future, each order will show payment status, shipping progress, tracking number, and delivery timeline here.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {["Order placed", "Packed", "Shipped", "Delivered"].map((step) => (
                  <div key={step} className="rounded-md border border-gold-100 bg-white p-3 text-sm font-semibold text-neutral-600">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            <h2 className="text-2xl font-bold">Wishlist</h2>
            <p className="mt-1 text-sm text-neutral-600">You have {wishlistCount} saved {wishlistCount === 1 ? "item" : "items"}.</p>
            <Link to="/wishlist" className="mt-5 inline-block">
              <Button>Open wishlist</Button>
            </Link>
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            <h2 className="text-2xl font-bold">Cart</h2>
            <p className="mt-1 text-sm text-neutral-600">You have {itemCount} cart {itemCount === 1 ? "item" : "items"}.</p>
            <p className="mt-3 text-lg font-bold">{formatMoney(cartTotal)}</p>
            <Link to="/cart" className="mt-5 inline-block">
              <Button>Open cart</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
