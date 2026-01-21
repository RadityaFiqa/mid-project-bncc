<?php

namespace App\Console\Commands;

use App\Http\Controllers\DashboardController;
use Illuminate\Console\Command;

class RefreshDashboardCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:refresh-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh dashboard data cache';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Refreshing dashboard cache...');

        $controller = new DashboardController();
        $controller->refreshCache();

        $this->info('Dashboard cache refreshed successfully!');

        return Command::SUCCESS;
    }
}
