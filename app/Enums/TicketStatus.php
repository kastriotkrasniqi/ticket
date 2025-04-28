<?php

namespace App\Enums;

enum TicketStatus: string
{
     // valid, used, refunded, cancelled

    case VALID = 'valid';
    case USED = 'used';
    case REFUNDED = 'refunded';
    case CANCELLED = 'cancelled';

}
