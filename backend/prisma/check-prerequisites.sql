-- Smart POS - Quick Dummy Data Check
-- Run this BEFORE loading dummy data to ensure prerequisites are met

-- ============================================
-- PREREQUISITE CHECK
-- ============================================

-- Check 1: Roles exist
SELECT 
    CASE 
        WHEN COUNT(*) = 3 THEN '✓ PASS: All 3 roles exist'
        ELSE '✗ FAIL: Missing roles. Run seed.sql first!'
    END as role_check,
    COUNT(*) as role_count
FROM "Role";

-- Check 2: Users exist
SELECT 
    CASE 
        WHEN COUNT(*) >= 3 THEN '✓ PASS: Users exist'
        ELSE '✗ FAIL: No users found. Create users first!'
    END as user_check,
    COUNT(*) as user_count
FROM "User";

-- Check 3: Show user details
SELECT 
    id,
    email,
    name,
    "roleId",
    (SELECT name FROM "Role" WHERE id = "User"."roleId") as role_name
FROM "User"
ORDER BY "roleId";

-- ============================================
-- SUMMARY
-- ============================================
SELECT 
    'Prerequisites Check' as check_type,
    (SELECT COUNT(*) FROM "Role") as roles,
    (SELECT COUNT(*) FROM "User") as users,
    CASE 
        WHEN (SELECT COUNT(*) FROM "Role") = 3 
         AND (SELECT COUNT(*) FROM "User") >= 3 
        THEN '✓ Ready to load dummy data!'
        ELSE '✗ Not ready - create roles and users first'
    END as status;
