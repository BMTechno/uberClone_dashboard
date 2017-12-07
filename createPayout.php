<?php

$price = $_POST["value"];
$email = $_POST["email"];

require __DIR__ . '/bootstrap.php';

// Create a new instance of Payout object
$payouts = new \PayPal\Api\Payout();


$senderBatchHeader = new \PayPal\Api\PayoutSenderBatchHeader();

$senderBatchHeader->setSenderBatchId(uniqid())
    ->setEmailSubject("You have a Payout!");


$senderItem = new \PayPal\Api\PayoutItem();
$senderItem->setRecipientType('Email')
    ->setNote('Thanks for your patronage!')
    ->setReceiver($email)
    ->setSenderItemId("2014031400023")
    ->setAmount(new \PayPal\Api\Currency('{
                        "value":"' . $price . '",
                        "currency":"USD"
                    }'));

$payouts->setSenderBatchHeader($senderBatchHeader)
    ->addItem($senderItem);


$request = clone $payouts;

try {
    $output = $payouts->createSynchronous($apiContext);
} catch (Exception $ex) {
    exit(1);
}
$status = json_decode($output, true);
echo $status['batch_header']['batch_status'];

return $output;
