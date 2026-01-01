<?php

namespace App\Exports;

use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Member;
use App\Models\Subscription;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;

class ReportsExport implements FromCollection, WithHeadings
{
    protected $type;
    protected $startDate;
    protected $endDate;

    public function __construct($type, $startDate, $endDate)
    {
        $this->type = $type;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        switch ($this->type) {
            case 'revenue':
                return Payment::where('status', 'completed')
                    ->whereBetween('payment_date', [$this->startDate, $this->endDate])
                    ->get()
                    ->map(fn($p) => [
                        'Date' => $p->payment_date,
                        'Amount' => $p->amount,
                        'Method' => $p->payment_method,
                        'Type' => $p->payment_type,
                        'Status' => $p->status,
                    ]);

            case 'attendance':
                return Attendance::with('member.user')
                    ->whereBetween('date', [$this->startDate, $this->endDate])
                    ->get()
                    ->map(fn($a) => [
                        'Date' => $a->date,
                        'Member' => $a->member->user->name ?? 'Unknown',
                        'Check In' => $a->check_in_time,
                        'Check Out' => $a->check_out_time ?? '-',
                    ]);

            case 'members':
                return Member::with('user')->get()->map(fn($m) => [
                    'Name' => $m->user->name ?? 'Unknown',
                    'Email' => $m->user->email ?? '-',
                    'Phone' => $m->user->phone ?? '-',
                    'Gender' => $m->gender,
                    'Join Date' => $m->join_date,
                    'Status' => $m->status,
                ]);

            case 'subscriptions':
                return Subscription::with(['member.user', 'plan'])
                    ->get()
                    ->map(fn($s) => [
                        'Member' => $s->member->user->name ?? 'Unknown',
                        'Plan' => $s->plan->name,
                        'Start Date' => $s->start_date,
                        'End Date' => $s->end_date,
                        'Status' => $s->status,
                        'Payment Status' => $s->payment_status,
                    ]);

            default:
                return collect([]);
        }
    }

    public function headings(): array
    {
        switch ($this->type) {
            case 'revenue':
                return ['Date', 'Amount', 'Method', 'Type', 'Status'];
            case 'attendance':
                return ['Date', 'Member', 'Check In', 'Check Out'];
            case 'members':
                return ['Name', 'Email', 'Phone', 'Gender', 'Join Date', 'Status'];
            case 'subscriptions':
                return ['Member', 'Plan', 'Start Date', 'End Date', 'Status', 'Payment Status'];
            default:
                return [];
        }
    }
}
