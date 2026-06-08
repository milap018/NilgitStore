import {
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
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

const tabMeta = {
  details: {
    eyebrow: "Account dashboard",
    title: "My details",
    description: "Keep your personal information ready so checkout, delivery updates, and future account tools feel smooth."
  },
  addresses: {
    eyebrow: "Delivery setup",
    title: "Manage addresses",
    description: "Save multiple delivery locations with receiver details, so you can switch between home, office, or gift addresses."
  },
  orders: {
    eyebrow: "Purchase history",
    title: "Orders",
    description: "This panel will hold tracking, payment status, and delivery milestones instead of opening a separate full screen."
  },
  wishlist: {
    eyebrow: "Saved picks",
    title: "Wishlist",
    description: "See how many favourites you have saved and jump straight back into shopping when you are ready."
  },
  cart: {
    eyebrow: "Shopping bag",
    title: "Cart",
    description: "Keep an eye on the number of items in your cart and the current subtotal before checkout."
  }
};

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

function countReadyAddresses(addresses) {
  return addresses.filter(
    (address) =>
      address.personName.trim() &&
      address.mobileNumber.trim() &&
      address.addressLine.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.postalCode.trim()
  ).length;
}

export default function Profile() {
  usePageTitle("Profile");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, logout } = useAuth();
  const { cartTotal, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const activeTab = validTabs.includes(searchParams.get("tab")) ? searchParams.get("tab") : "details";
  const currentTab = tabMeta[activeTab];
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

  const readyAddresses = countReadyAddresses(addresses);
  const detailHighlights = [
    {
      icon: ShieldCheck,
      label: "Profile status",
      value: profile.mobileNumber.trim() ? "Ready for checkout" : "Needs mobile number",
      note: profile.mobileNumber.trim()
        ? "Order updates can reach you faster."
        : "Add your phone number for delivery updates."
    },
    {
      icon: MapPin,
      label: "Saved addresses",
      value: addresses.length ? `${addresses.length} saved` : "No address yet",
      note: addresses.length
        ? `${readyAddresses} address${readyAddresses === 1 ? "" : "es"} complete`
        : "Your first delivery address can be added here."
    },
    {
      icon: Sparkles,
      label: "Shopping activity",
      value: `${wishlistCount} wishlist / ${itemCount} cart`,
      note: `Cart total ${formatMoney(cartTotal)}`
    }
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(217,154,0,0.18),transparent_44%),linear-gradient(135deg,#fffaf0,#ffffff)] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-300 bg-white text-2xl font-bold text-gold-800 shadow-soft">
                {getInitials(profile)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-600">Hello,</p>
                <h1 className="truncate text-2xl font-bold text-ink">{profile.name || "Nilgit customer"}</h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                  <Mail size={14} className="text-gold-700" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <p className="mt-3 inline-flex rounded-full border border-gold-300 bg-white px-3 py-1 text-xs font-semibold text-gold-800">
                  {isAdmin ? "Admin account" : "Customer account"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gold-200 pt-4">
              <div>
                <p className="text-lg font-bold text-ink">{wishlistCount}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Saved</p>
              </div>
              <div>
                <p className="text-lg font-bold text-ink">{itemCount}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Cart</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-ink">{addresses.length}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Addresses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft">
          {menuGroups.map((group) => (
            <div key={group.title} className="border-b border-gold-100 last:border-b-0">
              <p className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{group.title}</p>
              <div className="pb-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-12 w-full items-center gap-3 border-l-2 py-3 pl-5 pr-4 text-left text-sm font-semibold transition ${
                        isActive
                          ? "border-gold-600 bg-gold-50 text-gold-900"
                          : "border-transparent text-neutral-700 hover:bg-gold-50/70"
                      }`}
                      onClick={() => selectTab(item.id)}
                    >
                      <Icon size={18} className={isActive ? "text-gold-700" : "text-neutral-500"} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={16} className={isActive ? "text-gold-700" : "text-neutral-400"} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="flex min-h-12 w-full items-center gap-3 px-5 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="space-y-5 lg:min-w-0">
        <section className="overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft">
          <div className="flex flex-col gap-5 bg-[linear-gradient(135deg,rgba(255,248,225,0.95),#ffffff_70%)] px-6 py-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-700">{currentTab.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">{currentTab.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{currentTab.description}</p>
            </div>
            <p className="inline-flex w-fit items-center gap-2 rounded-md border border-gold-200 bg-white px-4 py-2 text-sm font-semibold text-gold-800 shadow-soft">
              <ShieldCheck size={16} />
              Changes save on this device
            </p>
          </div>
        </section>

        {activeTab === "details" && (
          <>
            <div className="grid gap-4 xl:grid-cols-3">
              {detailHighlights.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.label} className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{card.label}</p>
                        <h3 className="mt-3 text-xl font-bold text-ink">{card.value}</h3>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gold-50 text-gold-800">
                        <Icon size={20} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{card.note}</p>
                  </article>
                );
              })}
            </div>

            <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-ink">Personal information</h3>
                  <p className="mt-1 text-sm text-neutral-600">Update the basic details you want to use across checkout and account pages.</p>
                </div>
                <p className="inline-flex w-fit rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
                  Profile basics
                </p>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                <Input id="profileName" label="Full name" name="name" value={profile.name} onChange={handleProfileChange} />

                <div>
                  <span className="mb-2 block text-sm font-medium text-neutral-700">Your gender</span>
                  <div className="flex flex-wrap gap-3">
                    {["male", "female"].map((gender) => {
                      const isSelected = profile.gender === gender;

                      return (
                        <label
                          key={gender}
                          className={`inline-flex min-h-11 min-w-32 items-center gap-3 rounded-md border px-4 text-sm font-semibold transition ${
                            isSelected
                              ? "border-gold-500 bg-gold-50 text-gold-900 shadow-soft"
                              : "border-gold-200 bg-white text-neutral-700 hover:border-gold-400"
                          }`}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={isSelected}
                            onChange={handleProfileChange}
                          />
                          <span className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-gold-600" : "bg-neutral-300"}`} />
                          {gender === "male" ? "Male" : "Female"}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Input id="profileEmail" label="Email address" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
                <Input
                  id="profileMobile"
                  label="Mobile number"
                  name="mobileNumber"
                  value={profile.mobileNumber}
                  onChange={handleProfileChange}
                  placeholder="Enter mobile number"
                />
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gold-50 text-gold-800">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">Change password</h3>
                    <p className="text-sm text-neutral-600">This form is ready for the backend password API we add next.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="mt-6">
                  <div className="grid gap-4 xl:grid-cols-3">
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
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button type="submit">Save password</Button>
                    {message && <p className="text-sm font-semibold text-gold-700">{message}</p>}
                  </div>
                </form>
              </section>

              <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
                <h3 className="text-xl font-bold text-ink">Helpful notes</h3>
                <div className="mt-5 space-y-5 text-sm leading-6 text-neutral-600">
                  <div className="border-l-2 border-gold-300 pl-4">
                    <p className="font-semibold text-ink">What happens when I update my email or mobile number?</p>
                    <p className="mt-1">These profile values are stored locally right now, so the interface feels real before we connect backend profile updates.</p>
                  </div>
                  <div className="border-l-2 border-gold-300 pl-4">
                    <p className="font-semibold text-ink">Why keep this page in panels?</p>
                    <p className="mt-1">It keeps future sections like returns, saved cards, and tracking inside one professional account dashboard.</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === "addresses" && (
          <>
            <div className="grid gap-4 xl:grid-cols-3">
              <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Saved addresses</p>
                <h3 className="mt-3 text-2xl font-bold text-ink">{addresses.length}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Keep separate delivery locations for home, office, or gifting.</p>
              </article>
              <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Ready to use</p>
                <h3 className="mt-3 text-2xl font-bold text-ink">{readyAddresses}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">An address counts as ready when every receiver and postal field is filled.</p>
              </article>
              <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Quick action</p>
                <div className="mt-4">
                  <Button className="gap-2" onClick={handleAddAddress}>
                    <Plus size={17} />
                    Add address
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">The top action stays visible, and there is another add button after the address list.</p>
              </article>
            </div>

            {addresses.length === 0 ? (
              <section className="rounded-md border border-gold-100 bg-white p-10 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-800">
                  <Home size={28} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-ink">No address added yet</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                  Start with your most common delivery location. Once one address is saved, you can keep adding more for work, family, or gifts.
                </p>
                <div className="mt-6">
                  <Button className="gap-2" onClick={handleAddAddress}>
                    <Plus size={17} />
                    Add your first address
                  </Button>
                </div>
              </section>
            ) : (
              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <section key={address.id} className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Delivery address {index + 1}</p>
                        <h3 className="mt-2 text-xl font-bold text-ink">{address.personName.trim() || "Receiver details"}</h3>
                        <p className="mt-1 text-sm text-neutral-600">Fill every field so this address is ready for checkout.</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        onClick={() => handleRemoveAddress(address.id)}
                        aria-label={`Remove address ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
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
                  </section>
                ))}

                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-dashed border-gold-300 bg-white px-4 py-3 text-sm font-semibold text-gold-800 shadow-soft transition hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-100"
                  onClick={handleAddAddress}
                >
                  <Plus size={18} />
                  Add another address
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gold-50 text-gold-800">
                  <PackageCheck size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Order tracking will live here</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                    We are keeping orders inside the profile panel so this area can grow into a real customer dashboard instead of sending you to a separate page.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {["Order placed", "Payment confirmed", "Packed", "Tracking next"].map((step) => (
                  <div key={step} className="rounded-md border border-gold-100 bg-gold-50/50 p-4 text-sm font-semibold text-neutral-700">
                    {step}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
            <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
              <h3 className="text-xl font-bold text-ink">Wishlist summary</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                You currently have {wishlistCount} saved {wishlistCount === 1 ? "item" : "items"} waiting for a second look.
              </p>
            </section>
            <Link to="/wishlist" className="xl:self-start">
              <Button>Open wishlist</Button>
            </Link>
          </div>
        )}

        {activeTab === "cart" && (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
            <section className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
              <h3 className="text-xl font-bold text-ink">Cart summary</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                You have {itemCount} cart {itemCount === 1 ? "item" : "items"} with a current subtotal of {formatMoney(cartTotal)}.
              </p>
            </section>
            <Link to="/cart" className="xl:self-start">
              <Button>Open cart</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
