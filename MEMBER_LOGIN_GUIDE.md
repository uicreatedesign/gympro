# Member Login System - Complete Guide

## How It Works

### 1. **Two Separate Modules**
- **Users Module**: Handles authentication (login credentials, roles, permissions)
- **Members Module**: Handles gym member data (personal info, subscriptions, attendance)

### 2. **Linking Users & Members**
- Members table has `user_id` column (foreign key to users table)
- When creating a member, you can optionally create a login account
- One member = One user account (optional)

---

## Creating a Member with Login Access

### Option 1: Create Member with Login (Recommended)
1. Go to **Members** page
2. Click **Add Member**
3. Fill in member details (name, email, phone, etc.)
4. ✅ **Check "Create login account for this member"**
5. Enter a password
6. Click **Create**

**What happens:**
- Member record created in `members` table
- User account created in `users` table
- User assigned "Member" role automatically
- Member linked to user via `user_id`

### Option 2: Create Member First, Add Login Later
1. Create member without login
2. Go to **Users** page
3. Create user with same email
4. Assign "Member" role
5. Manually link by editing member and adding `user_id`

---

## Login Flow

### When Member Logs In:
1. Member enters email & password at `/login`
2. System authenticates user
3. **Middleware checks user role:**
   - If role = "Member" → Redirect to `/member/dashboard`
   - If role = "Admin/Manager" → Redirect to `/dashboard`

### Member Dashboard Shows:
- ✅ Membership status (plan, days remaining, expiry)
- ✅ Attendance this month
- ✅ Recent payments with invoice download
- ✅ Profile information

---

## User Roles

### Admin/Manager/Viewer
- Access: `/dashboard` (admin panel)
- Can manage members, plans, subscriptions, etc.

### Member
- Access: `/member/dashboard` (member portal)
- Can only view their own data
- Cannot access admin features

### Trainer
- Access: `/dashboard` (limited admin access)
- Can view assigned classes/members

---

## Testing the Flow

### Step 1: Create a Test Member with Login
```
Name: John Doe
Email: john@example.com
Phone: 9876543210
✅ Create login account
Password: password123
```

### Step 2: Logout from Admin
Click profile → Logout

### Step 3: Login as Member
```
Email: john@example.com
Password: password123
```

### Step 4: Verify Redirect
- Should automatically redirect to `/member/dashboard`
- See membership status, attendance, payments

---

## Database Structure

```
users table:
- id
- name
- email
- password
- status (active/inactive)

members table:
- id
- user_id (links to users.id) ← KEY LINK
- name
- email
- phone
- gender
- date_of_birth
- join_date
- status

role_user table:
- user_id
- role_id
```

---

## Key Points

✅ **Members can exist without login** (for walk-ins, cash members)
✅ **Members with login can access their dashboard**
✅ **One member = One user account** (if login enabled)
✅ **Automatic role-based redirect** after login
✅ **Members cannot access admin panel**
✅ **Admins cannot access member dashboard**

---

## Permissions

### Member Role Permissions:
- `view_member_dashboard` - Access member dashboard

### Admin/Manager Permissions:
- All module permissions (view, create, edit, delete)

---

## Common Issues & Solutions

### Issue: Member can't login
**Solution:** Check if:
1. User account created for member
2. "Member" role assigned to user
3. User status is "active"
4. `user_id` linked in members table

### Issue: Member sees admin dashboard
**Solution:** 
1. Check user roles - should only have "Member" role
2. Clear browser cache
3. Logout and login again

### Issue: Admin sees member dashboard
**Solution:**
1. Check user roles - should have "Admin" or "Manager" role
2. Middleware will auto-redirect to `/dashboard`

---

## Future Enhancements

- [ ] Member self-registration
- [ ] Password reset for members
- [ ] Member profile editing
- [ ] Subscription renewal from member dashboard
- [ ] Class booking from member dashboard
- [ ] Attendance check-in via QR code
