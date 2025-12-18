<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\ContactObserver;
use App\Observers\ManagementAliadoObserver;
use App\Observers\ManagementAfiliadoObserver;
use App\Observers\SpecialCaseObserver;
use App\Models\Contact;
use App\Models\Aliados\Management as ManagementAliados;
use App\Models\Afiliados\Management as ManagementAfiliados;
use App\Models\SpecialCases;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Contact::observe(ContactObserver::class);
        ManagementAliados::observe(ManagementAliadoObserver::class);
        ManagementAfiliados::observe(ManagementAfiliadoObserver::class);
        SpecialCases::observe(SpecialCaseObserver::class);
    }
}
