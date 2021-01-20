package com.example.firebasepushnotification;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

public class MainActivity extends AppCompatActivity {

    private final static String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                Object value = getIntent().getExtras().get(key);
                Log.d(TAG, "Key: " + key + " Value: " + value);
            }
        }

        //The main button of the app which triggers the whole process
        Button subscribeButton = (Button) findViewById(R.id.button);
        subscribeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Get token
                FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener( MainActivity.this,  new OnSuccessListener<InstanceIdResult>() {
                    @Override
                    public void onSuccess(InstanceIdResult instanceIdResult) {
                        String newToken = instanceIdResult.getToken();
                        Log.e(TAG,newToken);
                        Toast.makeText(MainActivity.this, "Token is:" + newToken, Toast.LENGTH_SHORT).show();
                        // Get symbol
                        TextView textView = (TextView) findViewById(R.id.requiredSymbol);
                        String symbol = textView.getText().toString();
                        Log.i("TEST", "Token is: " + newToken + "Symbol is: " + symbol +" Calling requestToServer");
                        //A helper method to commit a get request to the server
                        requestToServer(newToken, symbol);
                    }
                });
            }
        });
    }

    /**
     * A helper method to commit a get request to the server
     * @param token the token of the user's app
     * @param symbol the symbol(textView field) that the user has chosen
     */
    public void requestToServer(String token, String symbol){
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);

        final String SERVER_ADDRESS = "http://10.0.2.2:8080/";
        final String USERNAME = "user1234";
        String URL = SERVER_ADDRESS + "fire?user=" + USERNAME + "&token=" + token + "&symbol=" + symbol;
        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        Log.i(TAG,"Successfully got a response");
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i(TAG,error.getMessage());
                    }
                });

        // Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

}