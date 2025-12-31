<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/general', [
            'settings' => Setting::getAllSettings(),
        ]);
    }

    public function update(Request $request)
    {        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|max:2048',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:5',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'business_name' => 'required|string|max:255',
            'business_address' => 'nullable|string',
            'business_phone' => 'nullable|string|max:20',
            'business_email' => 'nullable|email|max:255',
            'business_website' => 'nullable|url|max:255',
            'timezone' => 'required|string',
            'date_format' => 'required|string',
        ]);

        if ($request->hasFile('app_logo')) {
            $path = $request->file('app_logo')->store('logos', 'public');
            Setting::set('app_logo', $path);
        }

        foreach ($validated as $key => $value) {
            if ($key !== 'app_logo') {
                Setting::set($key, $value);
            }
        }

        Setting::clearCache();

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}
