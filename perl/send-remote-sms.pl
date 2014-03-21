#!/usr/bin/perl

use LWP::UserAgent;
use JSON::XS;
use strict;

my $API_KEY = "Your API Key"; # Your api key
my $USER_MSISDN = 123456789; # Your msisdn in international format without plus
my $USER_PASSWORD = ""; # Your password
my $RECIPIENT_MSISDN = "+123456789"; # Recipient msisdn in international format 


my $response = request('/json/user/login', {
  "apiKey" => $API_KEY,
  "msisdn" => $USER_MSISDN,
  "password" => $USER_PASSWORD,
});

if ($response->{'errorCode'} == 0) {

  my $authToken = $response->{'authToken'};

  $response = request('/json/remote/sms/send', {
    "recipients" => [ $RECIPIENT_MSISDN ],
    "message" => "Hello, this a simple Perl test",
    "encoding" => 0,
    "smsConnectorId" => 0,
    "store" => 1,
    "authToken" => $authToken,
    "apiKey" => $API_KEY
  });

  if ($response->{'errorCode'} == 0) {
    print STDERR "your remote sms request has been succesfully send\n";
  } else {
    print STDERR "remote sms send request failed with error code $response->{'errorCode'}\n";
  }

} else {
  print STDERR "login request failed with error code $response->{'errorCode'}\n";
}

sub request {
  my ($path, $request) = @_;

  my $ua = LWP::UserAgent->new();
  my $jsonxs = JSON::XS->new->utf8;
  $ua->timeout(10);
  my $response = $ua->post('https://api.mysms.com'.$path, Content_Type => "application/json", Content => $jsonxs->encode($request));
  if ($response->is_success()) {
    return $jsonxs->decode($response->content());
  }
  return {"errorCode" => 99};
}
