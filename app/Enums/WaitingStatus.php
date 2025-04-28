<?php

namespace App\Enums;

enum WaitingStatus: string
{
    // waiting, offered, purchased, expired
    case WAITING = 'waiting';
    case OFFERED = 'offered';
    case PURCHASED = 'purchased';
    case EXPIRED = 'expired';

}
