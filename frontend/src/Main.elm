module Main exposing (Model, Msg(..), init, main, update, view)

import Browser
import Html exposing (Html, button, div, h1, img, text)
import Html.Attributes exposing (src)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import RemoteData exposing (WebData)



---- MODEL ----


type alias Model =
    {}


init : ( Model, Cmd Msg )
init =
    ( Model, Cmd.none )



---- CMD ----


hentNoe : Cmd Msg
hentNoe =
    Http.get "https://developer-api-sandbox.dnb.no/api/token?customerId={'type':'SSN', 'value':'29105573083'}" (Decode.field "title" Decode.string)
        |> RemoteData.sendRequest
        |> Cmd.map ReceiveData


postNoe : Cmd Msg
postNoe =
    let
        body =
            Http.jsonBody <|
                Encode.object
                    [ ( "test", Encode.string "hei" )
                    ]
    in
    Http.post "https://jsonplaceholder.typicode.com/todos/1" body (Decode.field "title" Decode.string)
        |> RemoteData.sendRequest
        |> Cmd.map ReceiveData



---- UPDATE ----


type Msg
    = NoOp
    | OnClickButton
    | ReceiveData (WebData String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        OnClickButton ->
            ( model, hentNoe )

        ReceiveData data ->
            ( model, Cmd.none )



---- VIEW ----


view : Model -> Html Msg
view model =
    div []
        [ img [ src "/logo.svg" ] []
        , h1 [] [ text "Your Elm App is working!" ]
        , button [ onClick OnClickButton ] [ text "Click me" ]
        ]



---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = \_ -> init
        , update = update
        , subscriptions = always Sub.none
        }
